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