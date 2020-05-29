---
title: Express
tags: Programming
categories: node
date: 2020-05-22 14:19:11
---
#### ORM(sequelize)  
ORM（Object Relational Mapping）对象关系映射，减小操作层的代码量，直接方便的操作数据库。  
使用前，确保sequelize已经安装  
```
npm install --save sequelize
npm install --save mysql2
```
```javascript
/*
* path: @src/models/message.js
*/
var Sequelize = require('sequelize')
var sequelize = new Sequelize(
    'nodesql',        //database name
    'root',           //database user
    '123456',         //database password
    {
        'dialect': 'mysql',
        'host': 'localhost',
        'port': 3306
    }
)

//表模型
var Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userName: {
        type: Sequelize.STRING(32),
    },
    content: {
        type: Sequelize.TEXT
    }
})

Message.sync();     //创建表

module.exports = Message;

/*
* path: @src/route/index.js
*/
var express = require('express');
var router = express.Router();
var Message = require('../models/message.js')
const {log} = console

//REST API
router.get('/get_msg', (req, res, next) => {
  Message.findAll().then(data => {
    res.json({
      errcode: 0,
      data
    })
  })
})

router.post('/add_msg', (req, res, next) => {
  var {userName, content} = req.body
  if(!userName || !content) {
    res.json({errcode: 600, desc: '参数无效'})
    return
  }
  var message = {
    userName: req.body.userName,
    content: req.body.content,
  }
  Message.create(message).then(data => {
    console.log('插入数返回res', data)
    res.json({data})
  }).catch(err => {
    console.log('/add_msg报错err', err)
  }) 
})
```
至此，基本的sequlize就可以跑起来了。   

#### JWT（token验证）  
jwt(jsonwebtoken)验证，前后端验证的一种方法。  
express实现jwt验证  
```javascript
// 安装 express-jwt
$ npm i express-jwt --save  

/*
* path: @/util/jwt.js
* 封装分发token和验证token函数
*/
var jwt = require('jsonwebtoken');
var signkey = 'secret123456';                   //随机串

const setToken = function(userid){
	return new Promise ((resolve, reject) => {
		const token = jwt.sign({
			_id: userid
		}, signkey,{ expiresIn:'36h' });
		resolve(token);
	})
}

const verToken = function (token) {
	return new Promise((resolve, reject) => {
    var info = jwt.verify(token.split(' ')[1], signkey);
    if(info) {
      resolve(info);
    } else {
      reject(info)
    }
	})
}

module.exports = {
  verToken,
  setToken,
}

/**
*  path: @/routes/index.js
*  首先在login接口分发token
*/

var express = require('express');
var router = express.Router();
var {Message, User} = require('../models/test.js')
const jwt = require('jsonwebtoken')
const setToken = require('../utils/middwares/jwt.js')

// 登录api
router.post('/login', async (req, res, next) => {
  const user = {}
  let {account, password} = req.body   //小程序这里应接受code，去换取openID存储
  let data = await User.findOne({
    where: {
      account: account,
    }
  })
  // console.log('查询结果返回：', JSON.stringify(data, null, 2))
  if(!data) {                          //不存在该用户，则创建用户
    user.account = account
    data = await User.create(user)
  }
  setToken.setToken(data.id).then(token => {
    return res.json({data: {data, token}})
  })
})

//请求内容
router.get('/getOne', (req, res, next) => {
  if(!req.data) {                      //验证token的中间件成功后，把验证结果放置在req.data中
    return res.json({
			msg:'token invalid',
      errcode: 600,
		})
  }
  Message.findAll().then(result => {
    res.json({
      errcode: 0,
      result,
    })
  })
})

/**
* path: @/app.js
* 配置token验证中间件
*/
var jwt = require('jsonwebtoken');
var verToken = require('./utils/middwares/jwt.js')

app.use(function(req, res, next) {
	var token = req.headers['authorization']
	if(!token) {
		return next();
	} else {
		verToken.verToken(token).then((data) => {
			req.data = data;
			return next();
		}).catch((error)=>{
			return next();
    })
    //上为封装方法,下为直接调用,都可以使用
    // let info = jwt.verify(token.split(' ')[1], 'secret123456');
    // req.data = info;
    // next()
	}
})

//过滤不需要token的路由
app.use(expressJwt({
  secret: 'secret123456'  // 签名的密钥 或 PublicKey
}).unless({
  path: ['/login',]      // 指定路径不经过 Token 解析
}))

//当token失效返回提示信息
app.use(function(err, req, res, next) {
	if (err.status == 401) {
		return res.status(401).send({msg: 'token invalid'});
	}
});

```
至此，token验证就可以跑起来了。在发送http时，headers中配置 `Authorization: 'Bearer ${token}'`即可，当然还可以继续再次封装。


#### middare(中间件)  
中间件用来处理后端服务，对前端的路由请求进行过滤处理。 
express本来就是服务加中间件的集合，不同的中间件构成了完整的api逻辑处理。  
应用级中间件绑定在APP内，路由中间件绑定在路由，除此之外，还有内置中间件，错误处理中间件等。  
不带有路由限制的中间件是会被所有路由执行的，
```javascript
app.use(middareFun)                //所有请求都会触发
app.use('/user/:id', middareFun)   ///user路径请求触发
```

这里我们优化了上面的 token 验证中间件。  
```javascript
/**
* path: @/utils/middares/paramsVerify.js
*/
var verToken = require('./jwt.js')

//请求时间
const requestTime = function(req, res, next) {
    req.requestTime = Date.now()
    next()
}

//解析token
const tokenVerify = function(req, res, next) {
	var token = req.headers['authorization'];
	if(!token){
		return next();
	} else {
		verToken.verToken(token).then((data)=> {
			req.data = data;
			return next();
		}).catch((error)=>{
			return next();
    })
	}
};

//这里可以一个一个导出，也可以直接写在数组内，导出数组即可（二选一）。
const middArr = [
  requestTime = function() {},
  tokenVerify = function() {},
]
module.exports = {
  requestTime,
  tokenVerify,
  middArr,
}

/**
* path: @/app.js
* 两种注册方式二选一即可
*/
let paramsVerify = require('./utils/middwares/paramsVerify.js')

//1.注册paramsVerify文件中所有的中间件（单个导出式）
let middwareArr = []
for(let i=0; i<Object.keys(paramsVerify).length; i++) {
  let item = paramsVerify[Object.keys(paramsVerify)[i]]
  middwareArr.push(item)                //干嘛不直接导出数组了？！en
  //app.use(item)                       
}
app.use(middwareArr)

//2.导出数组式
app.use(paramsVerify.middArr)            //完事，
```
至此，中间的剥离优化完整。
