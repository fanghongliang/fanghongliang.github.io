---
title: python-Web框架之flask学习总结
date: 2019-09-05 16:16:41
tags: 
  - Programming
categories: Python
---

# 序言
## version： Python3.7.0

# 内容

## 环境    
*Flask* 和 *Django* 目前是Python较为流行的Web框架。区别大致在与毛坯房和拎包入住型公寓，flask比较适用于后台管理系统，Django适合前端项目提供接口，这不是废话嘛，因为公司的后台就是这样用的（此处手动狗头.jpg）  
Flask和node比较着学习，理解起来快且容易。  
这里忽略安装Python和flask的步骤，具体请传送<https://dormousehole.readthedocs.io/en/latest/quickstart.html>  

## 入门
```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_interface():
    return {"status": 'ok', 'data': 'mockdata'}
```
上面的代码是最简单的Flask应用，运行后，通过postman测试localhost:5000端口，就可以拿到return里面的json数据，这点相比于node-Koa来说，返回的数据需要放在上下文（context）的body体中，有点简便啊  
洋葱圈模型中返回数据代码顺便复习一下：
```javascript
const Router = require('koa-router')
const router = new Router()

router.post('./v1/interface', (ctx, next) => {
    const path    = ctx.params
    const query   = ctx.request.query
    const headers = ctx.request.header
    const body    = ctx.request.body

    if( body.length == 0 ) {
        const error = new global.errs.ParameterException('错误',605)
    }
    if( query === 1 ) {
        ctx.body = {
            status: 'ok',
            code: 601,
            data: 'data'
        }
    }
})
```
Flask返回的数据模式相比Koa来说，太简略了吧，可能是一个get方法，一个post方法吧