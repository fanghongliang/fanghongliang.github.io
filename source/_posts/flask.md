---
title: Python-flask
date: 2020-06-05 16:36:31
tags: Programming
categories: Python
---
#### Base point
pycharm中打开debug模式：在终端中设置：
> set FLASK_ENV=development  (windows)
> export FLASK_ENV=developm  (mac)
> flask run
开启debug会
* 激活调试器。

* 激活自动重载。

* 打开 Flask 应用的调试模式。

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

* 查询结果  
一般使用db.session.query()来查询结果，结果返回一个list，多条数据处理需要用到遍历，单挑数据则可以使用一下方式获得值并返回  
> user = db.session.query(User).filter_by(name=''liming).all()


* 数据接收  

1. post json格式  

> data = json.loads(request.get_data(as_text = True))
> name = data.get('name')


2. get URL拼接  

> param = request.args['param'] 

* 新增数据并提交数据库

> user = User(name="xxx", dender=0)
> db.session.add(user)
> db.session.commit()

* 更新数据  

> user = db.session.query(User).filter(name=param.get('name')).first()
> user.attr = param.get('attr')
> db.session.commit()

#### Faker  
生成大量的模拟数据  

> pip install Faker

```python
from faker import Faker
faker = Faker('zh-CN')   # 默认美国

for item in range(100): 
    fname = faker.name()
    faddress = faker.address()
    fint = faker.pyint()
    user = User(name=fname, address=faddress, xxx=fint)
    db.session.add(user)
try:
    db.session.commit()
except: 
    db.session.rollback()
```
#### flask_restplus  

* pip install flask-restplus   
* from flask_restplus import Api

Flask-RESTPlus提供的主要创建对象就是资源。资源创建于Flask可插入视图（pluggable view）之上，使得我们可以通过在资源上定义方法来很容易地访问多个HTTP方法。


####  flask_cors 
解决跨域

* from flask_cors import CORS
* if Config.FLASK_ENV == 'DEVELOPMENT':
* CORS(app, supports_credentials=True)
