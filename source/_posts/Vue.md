---
title: 'Vue'
tags: Programming
categories: Vue
date: 2020-09-27 17:07:25
---

## Vue响应式原理  

Vue的数据响应式原理主要基于 Object.defineProperty() 函数来劫持数据变化，以及使用发布-订阅者模式达到更新数据的做法。     
首先要设置一个监听器Observer,用来监听所有的属性，当属性变化时，就需要通知订阅者Watcher,看是否需要更新．因为属性可能是多个，所以会有多个订阅者，故我们需要一个消息订阅器Dep来专门收集这些订阅者，并在监听器Observer和订阅者Watcher之间进行统一的管理．以为在节点元素上可能存在一些指令，所以我们还需要有一个指令解析器Compile，对每个节点元素进行扫描和解析，将相关指令初始化成一个订阅者Watcher，并替换模板数据并绑定相应的函数，这时候当订阅者Watcher接受到相应属性的变化，就会执行相对应的更新函数，从而更新视图．

整理上面的思路，我们需要实现三个步骤，来完成双向绑定： 

1. 实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者。
 
2. 实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图。
 
3. 实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器。


```javascript
let {log} = console

function defineReactive(data,key,val) {
  observe(val);  //递归遍历所有的属性
  Object.defineProperty(data,key,{
      enumerable:true,         //当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。
      configurable:true,       //当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中
      get() {
          return val;
      },
      set(newVal) {
          val = newVal;
          log(`属性${key}已被监听，现在值为"${newVal.toString()}"`)
      }
  })
}


function observe(data) {
  if(!data || typeof data !== 'object') {
      return;
  }
  Object.keys(data).forEach(function(key){    //遍历每一个数据
      defineReactive(data,key,data[key]);
  });
}

let data = {
  user1: {
      name: ''
  },
  user2: ''
};
observe(data);
data.user1.name = '约翰'; // 属性name已经被监听了，现在值为：“约翰”
data.user2 = '鲍勃';      // 属性book2已经被监听了，现在值为：“鲍勃”

```  

通过上面的代码，我们模拟了Vue实例的数据监听实现过程，这里也很好的解释了为什么页面需要的数据字段必须得在Vue实例挂载前就要注册在 data 对象中，不能动态的在data中设置数据字段，或者说动态的在 data 中设置字段，该字段是不能双向绑定的。原因就在于Vue实例挂载时，已经遍历了data 并为data中每个值都执行了Object.defineProperty(),而之后data中的数据自然就不会监听。  





