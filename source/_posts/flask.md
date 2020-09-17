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

#### namedtuple 
namedtuple是继承自tuple的子类。namedtuple创建一个和tuple类似的对象，而且对象拥有可访问的属性。

#### 用户权限细粒度管理  

用户权限是一个常见的业务，这里使用scope模块在 token 进行验证时判断用户的接口访问权限，并且自定义的 scope 可以进行权限的合并与筛选，进行普通用户和管理员权限区分。scope 提供两套权限机制，api级别和蓝图级别，粒度粗细可以自己选择，十分灵活。

```python 
# scope.py

class Scope:
    allow_api = []                 # api 级别的权限控制  粒度细
    allow_module = []              # 蓝图级别权限控制    粒度粗
    forbidden = []                 # 权限筛选

    def __add__(self, other):
        # 管理员合并普通用户权限
        # 运算符重载
        self.allow_api = self.allow_api + other.allow_api
        # set 去重
        self.allow_api = list(set(self.allow_api))
        # 红图级别权限相加
        self.allow_module = self.allow_module + other.allow_module
        self.allow_module = list(set(self.allow_module))
        # 逆向筛选权限
        self.forbidden = self.forbidden + other.forbidden
        self.forbidden = list(set(self.forbidden))
        return self


class UserScope(Scope):
    allow_api = ['v1.user+get_user']
    allow_module = []
    forbidden = ['v1.user+super_get_user',
                 'v1.user+super_delete_user']

    def __init__(self):
        self + AdminScope()


class AdminScope(Scope):
    # allow_api = ['v1.user+super_get_user',
    #              'v1.user+super_delete_user']
    allow_module = ['v1.user']

    def __init__(self):
        # 排除 筛选视图函数
        # self + UserScope()
        pass 


def is_in_scope(scope, endpoint):
    # scope()
    # globals
    # 反射
    # token 内部携带权限参数，直接判断权限
    # v1.red_name + view_func
    scope = globals()[scope]()
    splits = endpoint.split('+')
    red_name = splits[0]
    if endpoint in scope.forbidden:
        return False
    if endpoint in scope.allow_api:
        return True
    if red_name in scope.allow_module:
        return True
    else:
        return False

# token_auth.py  

from app.libs.scope import is_in_scope

auth = HTTPBasicAuth()
User = namedtuple('User', ['uid', 'ac_type', 'scope'])


@auth.verify_password
def verify_password(token, password):
    user_info = verify_auth_token(token)
    if not user_info:
        return False
    else:
        g.user = user_info
        return True


def verify_auth_token(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except BadSignature:
        raise AuthFailed(msg='token is invalid', error_code=1002)
    except SignatureExpired:
        raise AuthFailed(msg='token is expired', error_code=1003)
    uid = data['uid']
    ac_type = data['type']
    scope = data['scope']
    # 视图函数
    allow = is_in_scope(scope, request.endpoint)
    print('验证token参数--', uid, ac_type, scope, request.endpoint)
    if not allow:                          # 在这里拦截不同权限用户
        raise Forbidden()                     
    return User(uid, ac_type, scope)
```
