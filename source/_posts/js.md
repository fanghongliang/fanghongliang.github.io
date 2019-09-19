---
title: javascript
date: 2019-09-12 16:25:21
tags:
categories: Javascript
---

#### Array
##### 属性：
Array.length
##### 方法：
Array.from()  
从类数组对象或者可迭代对象中创建一个新的数组实例  
```javascript
<!-- 数组去重 -->
const arr = [1,3,5,56,3,2,1]
const res = Array.from(new Set(arr))
```
Array.isArray()  
用来判断某个变量是否是一个数组对象。
```javascript
const obj = {'key': 'value'}
Array.isArray(obj)       // false
```

Array.of()
根据一组参数来创建新的数组实例，支持任意的参数数量和类型  

##### Array instance
属性：  
Array.prototype.constructor  
返回值 Array  

Array.prototype.length  
返回值长度  

方法：  
修改器方法：下面的这些方法会改变调用它们的 *对象自身* 的值    
```javascript
Array.prototype.copyWithin()
Array.prototype.fill()
Array.prototype.pop()
Array.prototype.push()
Array.prototype.reverse()
Array.prototype.shift()
Array.prototype.sort()
Array.prototype.splice()
Array.prototype.unshift()
```
访问方法：以下方法不会改变调用它们的对象的值，只会返回一个新的数组或者返回一个其它的期望值。
```javascript
Array.prototype.concat()
Array.prototype.includes()
Array.prototype.join()
Array.prototype.slice()
Array.prototype.toString()
Array.prototype.toLocaleString()
Array.prototype.indexOf()
Array.prototype.lastIndexOf()
```
迭代方法：
```javascript
Array.prototype.forEach()
Array.prototype.every()
Array.prototype.some()
Array.prototype.filter()
Array.prototype.map()
Array.prototype.reduce()
Array.prototype.reduceRight()
```

#### String
##### 属性：  
String.prototype  

##### 方法：  
String.fromCharCode()   
通过一串 Unicode 创建字符串

##### String instance
属性:  
String.prototype.constructor  
返回值 String  

String.prototype.length
字符串长度  

方法：  
```javascript
String.prototype.charAt()
String.prototype.charCodeAt()
String.prototype.codePointAt()
String.prototype.concat()
String.prototype.includes()
String.prototype.endsWith()
String.prototype.indexOf()
String.prototype.lastIndexOf()
String.prototype.localeCompare()
String.prototype.match()
String.prototype.normalize()
String.prototype.padEnd()
String.prototype.padStart()
String.prototype.repeat()
String.prototype.replace()
String.prototype.search()
String.prototype.slice()
String.prototype.split()
String.prototype.startsWith()
String.prototype.substr()
String.prototype.substring()
String.prototype.toLocaleLowerCase()
String.prototype.toLocaleUpperCase()
String.prototype.toLowerCase()
String.prototype.toUpperCase()
String.prototype.toString()
String.prototype.trim()
String.prototype.trimLeft()
String.prototype.trimRight()
String.prototype.valueOf()
```

#### Object
##### Object构造函数方法
```javascript
Object.assign()
Object.create()
Object.defineProperty()
Object.defineProperties()
Object.entries()
Object.freeze()
Object.getOwnPropertyDescriptor()
Object.getOwnPropertyNames()
Object.getOwnPropertySymbols()
Object.getPrototypeOf()
Object.is()
Object.isExtensible()
Object.isFrozen()
Object.isSealed()
Object.keys()
Object.values()
Object.preventExtensions()
Object.seal()
Object.setPrototypeOf()
delete obj.property
```




