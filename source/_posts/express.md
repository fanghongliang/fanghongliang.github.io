---
title: Express
tags: Programming
categories: node
date: 2020-05-22 14:19:11
---

express文档  ： https://www.expressjs.com.cn/guide/using-middleware.html  
sequelize文档:  https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/Readme.md
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

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userName: {
        type: Sequelize.STRING(32),
    },
    age: {
        type: Sequelize.INTEGER
    },
    gender: {
        type: Sequelize.INTEGER
    },
    address: {
        type: Sequelize.STRING(32)
    }
})

Message.sync();     //创建表
User.sunc()

module.exports = {Message, User};

/*
* path: @src/route/index.js
* desc: 在路由中完成增删改查
*/
var express = require('express');
var router = express.Router();
var Message = require('../models/message.js')
const setToken = require('../utils/middwares/jwt.js')
const {log} = console

//REST API
//用户登录
router.post('/login', async (req, res, next) => {
  const user = {}
  let {userName} = req.body
  let data = await User.findOne({
    where: {
      userName: userName
    }
  })
  // log('查询结果返回：', JSON.stringify(data, null, 2))
  if(!data) {                                      //不存在用户则创建用户
    user.userName = userName
    data = await User.create(user)
  }
  setToken.setToken(data.id).then(token => {       //返回用户信息及token
    return res.json({data: {data, token}})
  })
})

//查找某内容
router.get('/getOne', (req, res, next) => {
  if(!req.data) {
    return res.json({
			msg:'token invalid'
		})
  }
  Message.findAll().then(data => {
    log('查找数据res', JSON.stringify(data, null, 2))
    res.json({
      errcode: 0,
      data
    })
  })
})

//删除一个用户
router.get('/del_user', async (req, res, next) => {
  let {userName} = req.query
  let result = await User.findOne({
    where: {userName,}
  })
  if(!result) {
    return res.json({msg: '不存在该用户', errcode: 601})
  }
  let data = await result.destroy()
  return res.json({msg: '删除成功', errcode: 0})
})

//更新用户信息
router.post('/rich_user_info', async (req, res, next) => {
  let data = req.body
  let result = await User.findOne({
    where: {userName: data.userName}
  })
  //用数据表的result字段来匹配前端上传的字段！前端随便传参，我只过滤有用的
  Object.keys(result.toJSON()).map(item => {   
    data[item] ? result[item] = data[item] : ''
  })
  await result.save()
  res.json({msg: 'succ', data: result})
})
```
至此，基本的sequlize就可以跑起来了。  

#### 原生SQL方法  
sequelize的确方便，但他的查询语句较为繁琐，这里我们还可以使用原生mysql语句。  
```javascript
/**
* path: utils/dbConfig.js
* 数据库配置
*/
mysql = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodesql'
}

module.exports = mysql;

/**
* path: @/db.js
* 手动连接数据库
*/
let mysql = require('mysql')
let dbConfig = require('./utils/dbConfig')
const {log} = console

module.exports = {
    query: function(sql, params, callback) {
        let conn = mysql.createConnection(dbConfig)
        conn.connect(function(err) {
            if(err) {
                log('数据库连接失败')
                throw err
            }
            conn.query(sql, params, function(err, res, fields) {
                if(err) {
                    log('数据库操作失败')
                    throw err
                }
                callback && callback(res);
                conn.end(err => {
                    if(err) {
                        log('数据库关闭失败')
                        throw err
                    } 
                })
            })
        })
    }
}

/**
* path: @/route/index.js
* 路由使用
*/
router.get('/user', (req, res, next) => {
  let {id} = req.query
  const sql = `select * from user where id = ${id}`  //复杂SQL语句
  db.query(sql, [], function(result, fields) {
    let data = JSON.parse(JSON.stringify(result))
    data1 = req.requestTime
    res.json({
      status: 0,
      data,
      data1
    })
  })
})

```
ORM和原生SQL语句之间并不冲突，合理选择使用即可。两个一起用也可以

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
不带有路由限制的中间件是会被所有路由执行的。    
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

#### 封装log  
在调试中，可以封装一个log用来替代 `console.log`  

```javascript
/**
* path: @/utils/log.js
*
*/
Date.prototype.Format = function (fmt) {
var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
};
if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
}

function log() {
    const show = true        //也可以和开发环境挂钩控制日志输出
    if (show) {
        console.log(`[${new Date().Format("yyyy-MM-dd hh:mm:ss")}] `, ...arguments)
    }
}

module.exports = log
```

#### 跨域  
在搭建完后端api后，需要在前端调试。无论是小程序还是vue的webapp,访问本地连接会出现跨域问题（小程序得在开发工具上关闭域名检测，小程序默认https），如图：  
[![1590993807462-27-D534-BC-CF10-4f1f-B87-F-DE781-B20-BC22.png](https://i.postimg.cc/gjPgxG3j/1590993807462-27-D534-BC-CF10-4f1f-B87-F-DE781-B20-BC22.png)](https://postimg.cc/KkJPVSqh)  
此时需要在app.js内加入允许跨域访问  
```javascript
/*
* desc: 以下跨域代码未处理 OPTION 形式，在request不携带自定义参数如 token 等headers内的配置时，是可以跑起来的，一旦在request内设置headers内容，请求会被 OPTION 挂起，跨域失败！
*/
//设置允许跨域访问该服务.（此代码为坑）
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})

/*
* desc: 跨域
* desc: 大胆copy
* path: @/app.js
*/
app.use((req, res, next) => {
  // 设置是否运行客户端设置 withCredentials
  // 即在不同域名下发出的请求也可以携带 cookie
  res.header("Access-Control-Allow-Credentials",true)
  // 第二个参数表示允许跨域的域名，* 代表所有域名  
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
  // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  if (req.method == 'OPTIONS') {
      res.sendStatus(200)
  } else {
      next()
  }
})
```
此时，我们的vue前端使用axios携带token就可以请求到服务端接口了   
[![1590994213733-89-C343-C2-BFF0-44a3-988-C-1-D0-D9-E0875-CF.png](https://i.postimg.cc/5NJxVvQd/1590994213733-89-C343-C2-BFF0-44a3-988-C-1-D0-D9-E0875-CF.png)](https://postimg.cc/CdvyCR4m)


#### morgan日志  
日志，记录服务器的操作行为，这里使用 morgan 把日志记录在本地文件保存。  

```javascript
/**
* path: @/utils/morgan.js
* desc: 封装一个morgan 
*/

var path = require('path');
var fs = require('fs')
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator')

var logDirectory = path.join(__dirname, 'log')

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

morgan.token('timeStamp', function(req, res){
    let date = new Date()
    let logHour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() 
    let logMinute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    let logSecond = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    let logDate = `${logHour}:${logMinute}:${logSecond}`
    return logDate
});
  
  // 自定义format，其中包含自定义的token
  morgan.format('joke', '[joke :timeStamp] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms');
  
  // create a rotating write stream
  var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
  })

module.exports = {morgan, accessLogStream}

/*
* path: @/app
* 引用这个日志系统
*/

app.use(morgan('joke'));                                   //服务器输入实时日志
app.use(morgan('short', {stream: accessLogStream}));       //记录日志在文件中

```  
至此，我们可以在 `/utils` 路径下看到创建的 log 文件夹，日志已经根据 *file-stream-rotator* 插件做了分割，每一天的日志集约在一个文件。以防日志过多导致混乱。  

-----  
> * 本项目git地址在[**这里**](https://github.com/fanghongliang/NodeProject), **欢迎star**   
> * 本项目部署服务器文档在[**这里**](http://fanghl.top/2020/06/09/server/#more)