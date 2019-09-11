---
title: Python与JavaScript对照学习总结点
---

## 序言

### Python： 廖雪峰-Python

### 传送门： <https://www.liaoxuefeng.com/wiki/1016959663602400>  

命令行打开 .py 文件；  
Python交互环境，执行Python代码

缩进方式进行代码格式！！4格空格缩进
大小写敏感

## 数据类型：
1. 整数 
2. 浮点数 
3. 字符串
4. 布尔值 =》 and, or, not
5. 空值 None
6. 列表
7. 字典

变量:
1. 常量，即不能变的变量，指针指向不变 类const，常量一般为变量名全部大写  

全局变量：  
全局变量globalData的定义，在读完了教程之后也没发现关于全局变量的定义，基于js的思想，在js中，全局变量取决于该变量定义的位置，传统web编程中，未添加定义符号（var, let, const）的变量都可被称为"全局变量",即使是 var 也存在一个变量提升的问题。Python中全局变量一般有两种方式：  
1. 声明式  
关键字 *global* 定义变量法。可以直接进行全局变量声明。  
`global OLD_URL`
2. 模块法  
模块法和js大同小异，js中没有关键字 *global* ，但是模块引用也是非常好用的，在中大型项目中，我们把项目中用到的常量单独提取出来放置在js文件中。在通过 *import* 来导入使用。Python中也是如此。

除法：
1. /   浮点数除法，即便是两个整数相除，结果也是浮点数
2. //  地板除，两个整数的除法仍然是整数，结果只取整数  10 // 3 =》 3
3.  %  求模取余

字符串编码：
1. ord()  数获取字符的整数表示
2. chr()  函数把编码转换为对应的字符  
Python的字符串类型是str，在内存中以Unicode表示  
Python对bytes类型的数据用带b前缀的单引号或双引号表示 x = b'abc'
3. encode() 方法可以编码为指定的bytes
4. decode() 方法 把bytes变为str  
如果bytes中只有一小部分无效的字节，可以传入errors='ignore'忽略错误的字节： b'\xe4\xb8\xad\xff'.decode('utf-8', errors='ignore')
5. len() 方法计算str的字符数  
1个中文字符经过UTF-8编码占用3个字节，而1个英文字符只占用1个字节。
6. 坚持 utf-8 编码
7. 文件开头写上： 
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
```

## 格式化：  
1. Python与C一致，都采用 % 实现   
%运算符就是用来格式化字符串的。在字符串内部，%s表示用字符串替换，%d表示用整数替换  
` 'age: %s. nmae: %s' %(25, fhl) `  
2. format() 格式化，比较麻烦  


list 和 tuple :
1. list : 列表。类数组 Array
` classmates = ['xaioming', 'xiaohua', 'xiaoliu']`   
获取最后一个元素 classmates[len(classmates) - 1]  或者  classmates[-1]  
2. list 方法：  
append(content) 末尾插入  
insert(index, content)  插入指定位置  
pop() 删除末尾元素  
pop(index) 删除指定位置元素   

3. tuple 元组，有序列表  
一旦初始化，不能更改。没有append、insert方法，其他和list一致  
因为不能更改，故更为安全，能用tuple代替list就尽量用tuple！  
` t = (1,)`
` t = ('str', 23, ['a'])`  

条件判断:
```python
    if age >= 18:
        print('成年人')
    elif age >= 1:
        print('幼儿期')
    else: 
        print('婴儿期')
```
int()  转化为整数函数


## 循环
1. for...in循环
2. while 循环
3. range() 生成一个整数序列,再通过list()函数可以转换为list
4. break 退出循环    配合if使用
5. continue 跳过循环   配合if使用


使用dict和set：  
dictionary字典，其他语言叫map，使用key-value存储，也就是js的对象。json的话，本质是字符串，也可以类比吧。  
`d = {'name': 'fhl', 'age': 22, }`   
PS: 区别点： js的对象可以使用 . 方法调用，Python目前只能 d['age']或者 d.get('age',-1)获取存储的值  
删除一个key，可以用 pop(key)  
dictionary是空间换时间的方法，list时间换空间  


## set 
同js中的key同根同源，存储key的集合,不存储value，且key不重复！！！  
创建set，需要一个list作为输入集合  
1. add(key) 添加元素到set中，重复添加不会有效果   
2. remove(key) 删除元素
3. set可看做成无序、无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等
```python
s1 = set([1, 3, 54])
s2 = set([2, 3, 4])
s1 & s2    # 并 ，单个& 
s1 | s2     # | 或，单个| 
```

## 函数 
自带函数（内置函数）： abs() 、max()  
数据类型转换函数： int() float()  str() bool() 参考js的数据转换函数 String() Number()  Boolean()
### 定义函数：  
关键字： def, 依次写出函数名、括号、括号中的参数和冒号:,然后，在缩进块中编写函数体，函数的返回值用return语句返回   
类比js: 关键字function ，后面都一致，然后把 冒号 换成 js中的 大括号 即可
```python 
def my_abs(num): 
    if x >= 10: 
        return x
    else: 
        return -x
```
执行函数： 相比于Python，js的函数执行比较简单，定义完函数后，直接用函数名字加一对小括号就可以调用当前函数，但Python貌似得先导入该函数，才可以调用
```python
from test import my_abs
my_abs(-1)
```
### pass关键字  
pass语句啥都不做，就和0一样，用来占位的。让程序可以跑起来。可以理解为斗地主时，你的牌大不过上家的，你就可以大吼一声： pass/过，让单线程的斗地主可以走下去，而不至于卡在这里，让队友喷你

### Python函数返回值  
js函数没有return语句时，返回的是 undefined。Python返回的是 None，在存在返回多个值的情况下。Python返回的是tuple，一个tuple可以被好多个变量接收，具体场景参考ES6的解构赋值，一毛一样。

### 默认参数  
没啥好讲的，和ES6函数默认参数一毛一样，默认参数在后，必填参数在前

### 可变参数  
参数前面添加 * ，在函数内部，参数numbers接收到的是一个tuple，因此，函数代码完全不变。但是，调用该函数时，可以传入任意个参数，包括0个参数，有点意思奥,即便我们的传参是list或者tuple，也可以在参数前加 * ，使得list或者 tuple 变为可变参数传进去

### 关键字参数  
**ky   
可变参数允许你传入0个或任意个参数，这些可变参数在函数调用时自动组装为一个tuple。而关键字参数允许你传入0个或任意个含参数名的参数，这些关键字参数在函数内部自动组装为一个dict。   
关键字参数有什么用？它可以扩展函数的功能。比如，在person函数里，我们保证能接收到name和age这两个参数，但是，如果调用者愿意提供更多的参数，我们也能收到。试想你正在做一个用户注册的功能，除了用户名和年龄是必填项外，其他都是可选项，利用关键字参数来定义这个函数就能满足注册的需求
```python
def person(name, age, **kw):
    if 'city' in kw:
        # 有city参数
        pass
    if 'job' in kw:
        # 有job参数
        pass
    print('name:', name, 'age:', age, 'other:', kw)
```
参数定义的顺序必须是：必选参数、默认参数、可变参数、命名关键字参数和关键字参数。

总结： *args是可变参数，args接收的是一个tuple；

**kw是关键字参数，kw接收的是一个dict。  

## 递归函数：  
### 尾递归优化
```python
def fact(n):
    if n==1:
        return 1
    return n * fact(n - 1)
```
以上代码是Python的递归代码，额，可能耦合性较高，函数内部使用了当前函数的名字，这高度耦合，在js里面我们可以通过 arguments.callee解决调用自身的问题，减小耦合。以下是js代码：  
```javascript
function fact(n) {
    if( n == 1 ) {
        return 1
    }
    return n * arguments.callee(n-1)
}
```

## 高级特性：   
### 切片 slice操作符
slice切片操作符，简单来说，就是给js的slice()函数做了一个语法糖，其他都一致
```python
L[0:5]    #[start:end]但不包括end，L为list或tuple
L[-2:-1]    #倒数第一个元素索引为-1
```
所有数，每5个取一个
```python
L = list(range(100))
L[:10]         # 前十个数
L[:-10]        # 后十个数     
L[:10:2]       # 前10个数，每两个取一个
L[::5]         # 所有数，每5个取一个
L[:]           # 赋值list
```
切片也可以对字符串使用，不需要单独的类似substring()方法

### 迭代
定义： 循环遍历list或者tuple，叫做迭代。
迭代通过 for...in...来完成   
Python可以迭代一切可迭代的东西   
判断一个对象是否是可迭代对象呢？
```python
from collections import Iterable
isinstance('abc', Iterable)    # 判断str是否是可迭代的对象，返回Boolean
```

### 列表生成式
就是简化了复杂列表生成的繁琐步骤  
```python
L = []                      # 实现一个 1*1, 2*2,....10*10的列表
for x in range(1, 11):      # 传统方法
    L.append( x * x )

[x*x for x in range(1, 10)]     # 列表生成器
[x*x for x in range(1, 10) if x % 2 == 0 ]     # 还可以加上 if 判断
[m+n for m in 'abc' for n in 'xyz']            # 双层循环
```
接下来，这行代码可能会让jser稍微羡慕一下，那就是操作文件
```python
import os               # 拿到了当前目录的所有文件夹
[d for d in os.listdir('.')]
```
js不能操作文件的，当然表亲 node.js是可以的   
dict的items() 方法可以同时迭代key和value，那么：   
```python
d = {'x': 'A', 'y': 'B', 'z': 'C'}
[k + '=' + v for k, v in d.items() ]
```

```python
d = {'Hello', 'WorLD'}      # 把list中所有的字符串小写
[s.lower() for s in d]
```

### 生成器
列表元素可以按照某种算法推算出来，那我们是否可以在循环的过程中不断推算出后续的元素呢？这样就不必创建完整的list，从而节省大量的空间。在Python中，这种一边循环一边计算的机制，称为生generator  
1. 列表生成式的 [] 改成 () 即可创建生成器
```python
L = [x * x for x in range(10) ]        #列表生成式
g = (x * x for x in range(10) )        # g是一个generator、next（）方法打印值
```
generator保存的是算法，每次调用next(g)，就计算出g的下一个元素的值，直到计算到最后一个元素，没有更多的元素时，抛出StopIteration的错误  
一般，generator用for来循环，不用next()
```python
for n in g:
    print(n)
```
2. 如果一个函数定义中包含yield关键字，那么这个函数就不再是一个普通函数，而是一个generator：
```python
def fib(max):  
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1 
    return 'done'
```
PS::: enerator和函数的执行流程不一样。函数是顺序执行，遇到return语句或者最后一行函数语句就返回。而变成generator的函数，在每次调用next()的时候执行，遇到yield语句返回，再次执行时从上次返回的yield语句处继续执行  
用for循环调用generator时，发现拿不到generator的return语句的返回值。如果想要拿到返回值，必须捕获StopIteration错误，返回值包含在StopIteration的value中：
```python
    g = fib()
    while True:
        try:
            x = next(g)
        except StopIteration as e:
            print('Generator return value:', e.value)
            break
```

### 迭代器
可以直接作用于for循环的数据类型有以下几种：

一类是集合数据类型，如list、tuple、dict、set、str等；

一类是generator，包括生成器和带yield的generator function。

这些可以直接作用于for循环的对象统称为可迭代对象：Iterable。

可以使用*isinstance()*判断一个对象是否是 *Iterable* 对象  

而生成器不但可以作用于for循环，还可以被next()函数不断调用并返回下一个值，直到最后抛出StopIteration错误表示无法继续返回下一个值了。

可以被next()函数调用并不断返回下一个值的对象称为迭代器：Iterator。

可以使用 *isinstance()* 判断一个对象是否是 *Iterator* 对象：
```python
isinstance([], Iterator)
```
生成器都是Iterator对象，但list、dict、str虽然是Iterable，却不是Iterator。

把list、dict、str等Iterable变成 *Iterator* 可以使用 *iter()* 函数：
```python
isinstance(iter([]), Iterator)       # True
```
PS: Python的for循环本质上就是通过不断调用next()函数实现的  


## 函数式编程 


### 高阶函数
函数名是指向函数的变量（同js ），即函数本身可以被变量指着，在变量引用也是可以的  
一个函数接受另一个函数作为参数，这种函数称为高阶函数（同js） 

1. map/reduce  
map 和 js 的功能一致，即都是为 *Iterable* 的全部元素应用一种规则。这个规则一般是一个函数。不过语法上稍有不同,js的map是Array的一个方法。  

python: map()函数接收两个参数，一个是函数，一个是Iterable，map将传入的函数依次作用到序列的每个元素，并把结果作为新的Iterator返回。

```python
def f(x):
    return x*x
r = map(f, [1, 2, 3, 4])      # 返回的是list每项的平方

list(map(str, [1, 2, 32, 56])   # 把每一项变为字符串
```
```javascript
//js实现
const arr = [1, 2, 3, 4]
const r = arr.map(function(item) {
    return item*item
})
// ES6
const r = arr.map(item => {
    return iten*item
})
```
为什么js的map就只是Array的一个方法呢？我个人觉得。js的数据结构并没有Python那么灵活，因为js的for循环只能循环Array和Object，而反观Python就比较多了，本质来说，就是 Iterable 数据结构js只有Array和Object。而Python有很多，除了list和tuple，还有string也算，等等 

2. reduce
reduce把一个函数作用在一个序列[x1, x2, x3, ...]上，这个函数必须接收两个参数，reduce把结果继续和序列的下一个元素做累积计算,其效果就是：

```python
reduce(f,[x1, x2, x3]) = f(f(f(x1, x2,x3)))   #三个f关系？其实这就说明了reduce()这个函数的作用了。
```
比如说序列求和：
```python 
from functools import reduce 
def add(x, y):
    return x + y
reduce(add, [1, 3, 5, 7, 9])   #25
```
3. filter()
和map()类似，filter()也接收一个函数和一个序列。和map()不同的是，filter()把传入的函数依次作用于每个元素，然后根据返回值是True还是False决定保留还是丢弃该元素。

例如，在一个list中，删掉偶数，只保留奇数，可以这么写：
```python
def is_odd(n):
    return n % 2 == 1
```
js中的filter同样是Array的一个方法，用于过滤数组并返回一个新的数组
```javascript
const arr = [5, 16, 35, 15, 48]
const r = arr.filter(item => {     //返回r是一个大于18的数组
    item >= 18
})
```
相比于js来说。Python的filter和map类似，都可以作用于Iterable数据类型  


4. sorted()
排序内置函数，用法和js的sort()类似。但是js的sort()方法在未传参数的情况下，默认按照*字符编码*的顺序进行排序。
```python 
L = [1, 5, 15, 25, 8]
r = sorted(L)            #1,5,8,15,25
```
js的sort():
```javascript
let arr = [1, 5, 15, 25, 8]
arr.sort()     // 1,15,25,5,8
arr.sort(function(a, b){      //1,5,8,15,25
    return a - b
})
```
看下sorted()的强大：可以传入三个参数，第一就是排序的list，第二个是key的规则，第三个是反转倒叙：
```python
sorted(['bov','lv','hln', 'Zomp'], key = str.lower, reverse = True)
```
PS :  sorted()也是一个高阶函数。用sorted()排序的关键在于实现一个映射函数  

### 返回函数
简单看了下返回函数的定义，里面提到了*闭包*，这个js里面也经常提到的操作。简单说，闭包就是函数嵌套函数，内部的函数保存了外层函数的变量等参数，在外部函数被销毁后，内部函数依旧可以拿到外部函数的传参。这个概念js和Python没大的区别。
深层次理解的话，参考另外一篇博客： <https://www.cnblogs.com/fanghl/p/11417906.html>

### 匿名函数
关键字： *lambda*   
只能有一个表达式，不用写return，返回值就是表达式的结果
```python
list(map(lambda x: x * x, [1, 3, 5, 7] ))
#lambda x: 相当于：
def f(x):
    return x * x 
```
python的匿名函数和js的匿名函数不太一样，但作用大都相似，不用担心函数名冲突等等，简化写法等。
js里面的匿名函数已经升级到了ES6箭头函数模式，简单方便：
```javascript
item => {
    return item * item
}
(x, y) => {
    return x + y
}
```
js里面匿名函数用的较少，一般都是用了箭头函数替代了。匿名函数的使用场景我也想不出多少，但在定时器中使用较多：
```javascript
function test() {
    setTimeout(function() {
        console.log(1)
    }, 1000 * 2)
}
// 不过一般都箭头简化了
function test() {
    setTimeout(() => {
        console.log(1)
    }, 1000 * 2)
}
```

### 装饰器
代码运行期间动态增加功能的方式，称之为“装饰器”（Decorator）  
函数也是一个对象，而且函数对象可以被赋值给变量，所以，通过变量也能调用该函数  
*_name_* 函数对象的该属性可以拿到函数的定义时名字   
没看懂，等懂了再回来写


### 偏函数
个人理解又是一个语法糖！减少一些函数的繁杂写法  
关键模块：*functools*  *partial*
```python
import functools
int2 = functolls.partial(int, base = 2)
# 创造一个偏函数int2，来进行2进制的转化，base是int内置函数固有的参数
```

## 模块
模块是一组Python代码的集合，可以使用其他模块，也可以被其他模块使用  
创建自己的模块时，要注意：  
模块名要遵循Python变量命名规范，不要使用中文、特殊字符；  
模块名不要和系统模块名冲突，最好先查看系统是否已存在该模块，检查方法是在Python交互环境执行import abc，若成功则说明系统存在此模块  
1. 作用域   
\_\_xxx\_\_ 变量是特殊变量，可以被直接引用，但是有特殊用途  
_xxx或\_\_xxx这样的函数或者变量是非公开的（private），不应该被直接引用

2. 第三方模块安装
*pip*：安装第三方模块工具  
安装命令： 
`pip install xxx`

参照 *npm* 或者 *yarn* 包管理工具  

3. 安装常用模块 
*在使用Python时，我们经常需要用到很多第三方库，例如，上面提到的Pillow，以及MySQL驱动程序，Web框架Flask，科学计算Numpy等。用pip一个一个安装费时费力，还需要考虑兼容性。我们推荐直接使用Anaconda，这是一个基于Python的数据处理和科学计算平台，它已经内置了许多非常有用的第三方库，我们装上Anaconda，就相当于把数十个第三方模块自动安装好了，非常简单易用。*  
Anaconda官网: <https://www.anaconda.com/download/>  
国内镜像： <https://pan.baidu.com/s/1kU5OCOB#list/path=%2Fpub%2Fpython>  

## 面向对象编程 OOP
### 面向过程  
处理学生的成绩表，为了表示一个学生的成绩，面向过程的程序可以用一个dict表示
```python
std1 = {'name': 'bob', 'score': 95}
std1 = {'name': 'ming', 'score': 59}
```
处理学生成绩通过函数实现，打印学生成绩：
```python
def print_score(std):
    print('%s: %s' % (std['name'], std['score']))
```
面向过程，顾名思义，关心的是程序下一步怎么走？这个过程如何保持正确的走法。而面向对象，即万物皆对象，我们要考虑学生这个对象，然后直接创建这个对象，需要什么功能直接调用这个对象上面的方法即可，不用管过程！
### 面向对象  
```python
class Student(object):
    def __init__(self, name, score):
        self.name = name
        self.score = score
    
    def print_score(self):
        print('%s: %s' % (self.name, self.score))


xiaoming = Student('xiaoming', 95)
xiaohong = Student('xiaohong', 59)

xiaoming.print_score()
xiaohong.print_score()
```
奥，语言都是相通的，JavaScript的class和Python思路都是一毛一样啊，不过js中class还有继承、super()、constructor()等等，Python应该也有的，往下继续学习。
PS : js中定义的Class，创建实例需要 *new* 关键字

### 类和实例
1. 创建类
class + className + (继承自某个类)  
```python
class Students(object): 
    def __init__(self, xxx, xx1, xx2):
```
```javascript
class Student extends Person{     //js实现
    super()             //继承基类的属性
    constructor(name, age) {     //自己的属性
        this.speed = 30
        this.name = name
        this.age = age
    }
    otherMethods() {    //挂载到Student的原型链上
        doSth...
    },
    otherMethods1() {   //挂载到Student的原型链上
        doOther...
    }
}     

```

2. 创建实例
```python
# py
xiaoming = Student(arg)   
```

```javascript
// js
const xioaming = new Student(arg)
```
**看到这**，终于深刻体会到了为啥class一定要首字母大写！js里面可能体会不深，因为有 *new* 关键字在*class*之前，而py里面，如果不区分，那么很容易搞混*class* 和 *function*   

特殊方法*\_\_init__* 方法的第一个参数永远是self，表示创建的实例本身，因此，在__init__方法内部，就可以把各种属性绑定到self，因为self就指向创建的实例本身。  
*diff:*和普通的函数相比，在类中定义的函数只有一点不同，就是第一个参数永远是实例变量self，并且，调用时，不用传递该参数。

### 访问限制
外部代码还是可以自由地修改一个实例的name、score属性：
```python
xiaoming = Student('xiaoming', 95)
xioaming.score = 12    #可以修改实例的属性
```
大招来了！！！***如果要让内部属性不被外部访问，可以把属性的名称前加上两个下划线__***这个大招js里面可没有啊  
**在Python中，实例的变量名如果以__开头，就变成了一个私有变量（private），只有内部可以访问，外部不能访问**  
```python
class Student(object):
    __init__(self, name, age):
        self.__name = name
        self__age = age

```
这样在外部就无法访问到内部的私有变量了，只能调用内部方法来访问。·····~~~真的是这样的吗？（手动滑稽.jpg）,当然不是啦，***之所有我们无法从外部访问到__name,是因为Python解释器把该变量变成了 _Student__name ,所以呢，我们可以通过 短线 加 类名 加变量名继续来访问该私有变量***吃饱了撑着了吗？哈哈


### 继承和多态
有点C++的感觉了，毕竟js是没有显示的多态的~~~~~~   

等等，我理解完了，凉凉打脸。Python的多态指的是基类和子类拥有同样的方法时，子类覆盖基类..................emmmm，按照js来说，这就是原型链的查找基本原理啊，先在自己内部找，找不到了就顺着原型链往上查找，一毛一样的..........  
把py中的class理解为一种数据结构，这个数据结构和py自带的list,tuple,dict 没有任何区别。那么 *isinstance()* 不就可以用了
```python 
xiaoming = Student('xiaoming')
isinstance(xiaoming, Student)   # True  isinstance可以理解为派生

class Pupil(Student):
    pass

xiaoxioa = Pupil()
isinstance(xiaoxiao, Student)   # True  隔代的也算派生哦
```

*鸭子模型* 动态语言的鸭子类型特点决定了继承不像静态语言那样是必须的。

### 获取对象信息
1. type()  
判断对象类型，js中使用 *typeof()* , js判断字符串还可以更为准确的使用
`Object.prototype.toString().call()`题外话了，js的type判断基本类型好用，其他就还是用  *instanceof（）*  
这点上，JS和py还是高度相似的！！
type()   =====    typeof()    =====   基本类型  
isinstance() ==== instanceof()  ===== 判断对象 

2. dir()  
要获得一个对象的所有属性和方法，可以使用dir()函数，它返回一个包含字符串的list，比如，获得一个str对象的所有属性和方法  
仅仅把属性和方法列出来是不够的，配合getattr()、setattr()以及hasattr()，我们可以直接操作一个对象的状态,    
*js*中同理。setAttribute()、getAttribute()、hasAttribute()

### 实例属性和类属性
总结一句话，就是class的类属性各个实例都会访问到，实例的实例属性各自相互独立。
可以把这两个概念理解为 JS 基类中的方法，子类都会顺着原型链找到并访问到。
```python
class Student(object):
    school = 'hantaiMiddleSchool'   #所有实例都可以访问到
```

## 面向对象高级编程

### \_\_slots__
slots的作用就是动态给class添加属性的一个约束，否则在class类建立完毕后，运行代码的时候动态随意绑定属性不就乱套了，需要一个约束，职责就是 *slots*  
*slots* 英文： 插槽。在Vue中使用的广泛，可以理解为在这预先给你留了个位置，以后想用的时候可以用，没有留这个位置的话，以后相用都用不了，可以理解为图书馆同学帮你*占座*
```python
#python
class Student(object):
    __slots__ = ('name', 'age')

>>> s = Student()
>>> s.name = 'xiaoming'    # 可以绑定成功
>>> s.score = 98           # 会报错，“唉，这位置有人了，你坐不了（手动滑稽.jpg）”
```
PS : 使用__slots__要注意，__slots__定义的属性仅对当前类实例起作用，对继承的子类是不起作用  

### @property
解决问题前言：给Class绑定属性时，直接把属性暴露出去，写起来简单，调用起来简单，但是没办法检查参数，导致可以随便修改值。这不合理  
解决1：  
```python
#Python
#Python设置set、get方法来控制属性解决验证问题
class Student(onject):

    def get_score(self):
        return self.score
    
    def set_scsoe(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be int')

        if value < 0 or value > 100:
            raise ValueError('score must be 0-100')

        self.score = value

```
但是，上面的调用方法又略显复杂，没有直接用属性这么直接简单  
*有没有既能检查参数，又可以用类似属性这样简单的方式来访问类的变量呢？对于追求完美的Python程序员来说，这是必须要做到的！*
*还记得装饰器（decorator）可以给函数动态加上功能吗？对于类的方法，装饰器一样起作用。Python内置的@property装饰器就是负责把一个方法变成属性调用的：*  
总结起来：语法糖，本质没变，但是简化了调用的繁琐程度
```python 
class Student(object):

    @property
    def score(self):
        return self.score

    @score.setter         # 可读可写属性
    def score(self, valule):
        if not isinstance(value, int):
            raise ValueError('score must be int')

        if value < 0 or value > 100:
            raise ValueError('score must be 0-100')
        self.score = value

    @property               #只读属性
    def age(self):
        return 23
#这样，就依旧可以使用属性的.调用方法访问属性、设置属性值了
```
总结：@property广泛应用在类的定义中，可以让调用者写出简短的代码，同时保证对参数进行必要的检查，这样，程序运行时就减少了出错的可能性 

### 多重继承
**关键字**：一个子类可以拥有多个基类、mixin
class需要新的功能，只需要在继承一个基类就可以了，*通常，主线都是单一继承下来的 *  为了更好地看出继承关系，我们把主线之外需要继承的基类命名为 *Mixin*，这样的的设计通常称为 *Mixin*
```python
class Person(object):
    pass

class ChineseMixin(Person):
    pass

class ChinaPuple(Person, ChineseMixin):
    pass
```

### 定制类
**重点：**前后双下划线的变量是特殊变量，py有特殊用途的！！  
\_\_slots__  
\_\_len__()
\_\_str__
\_\_repr__  
\_\_iter__  
\_\_getitem__   
\_\_setitem__  
\_\_getattr__  
\_\_call__  
上面罗列的方法未查看相关作用，以后需要用到在查看不迟，就最后一个 \_\_call__ ,在js 中调用自身的有 arguments.callee()

### 枚举类



















...持续更新.......