---
title: Python-flask
date: 2020-06-05 16:36:31
tags: Programming
categories: Python
---

#### 目录架构  

flask没有标准的目录架构，这里的目录结构如下  

> project_name
>> app
>>>

#### 创建虚拟环境  
 
> python -m venv env

* 激活虚拟环境（win）
> $ env\Scripts\activate
> 然后在虚拟环境中安装flask等

#### 依赖  

* 生成依赖文件
> pip freeze > requirements.txt  

* 安装依赖
> pip install -r requirements.txt

#### flask_script  

flaks_script通过命令的方式操作flask，跑起来开发版服务器、设置数据库，定时任务等。

```python 
# manage.py
from flask_script import Manager
app = Flask(__name__)

manager = Manager(app)

def hello(): 
    pass
manager.add_command('hello', hello())

# 装饰符命令
@manager.command
def hello(): 
    pass
```
通过自定义方法操作flask，使用方法为：  
> $ python manage.py hello

#### Blueprint  

蓝图模块，帮助我们对于整体项目的分割，利于后续的管理和拓展。主要分为设置蓝图，注册蓝图，路由使用蓝图三部分。  

```python

# @/api/user/controllers.py
from flask import Blueprint 
user = Blueprint('user', __name__)

"""
创建用户
"""
@user.route('/register', methods= ['get'])
def user_register():
    pass

# @__init__.py  
def create_app():
    app = Falsk(__name__)
    from om_core.api.user.controllers import user
    app.register_blueprint(user, url_prefix='/api/users')
```
至此，URL使用 localhost:5000/api/users/register 就可以访问注册路由。 

#### flask-SQLAlchemy  

