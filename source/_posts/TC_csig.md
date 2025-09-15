---
title: TC-技术文章集合
tags: 默认
categories: 默认
date: 2020-10-16 19:45:59
---


### 导语

一直在发布新的文章，零零散散，即自己不方便后续维护，读者也难以有效把知识串联起来，这里准备后续把之前的文章按类别项目合并成单个大文章，通过子目录的形式包含内容，更清晰的展现文章脉络，方便阅读。



### 管道函数


#### 管道函数是什么？

#### 作用

```js

function pipe(...functions) {
  return function(initialValue) {
      return functions.reduce((accumulator, currentFunction) => {
          return currentFunction(accumulator);
      }, initialValue);
  };
}

// 示例函数
const add1 = x => {
  log('step 1')
  return x + 1
}
const multiply2 = x => {
  log('step 2')
  return  x * 2
};
const subtract3 = x => {
  log('step 3')
  return x - 3

};

// 创建管道
const myPipe = pipe(add1, multiply2, subtract3);

// 使用管道
const result = myPipe(5); // ((5 + 1) * 2) - 3 = 9
console.log(result); // 输出: 9

```


#### 结语

### sendBeacon

#### sendBeacon的作用过及用途


### RUM（真实用户监控）的技术核心思路随笔


#### 为什么要有前端监控


#### RUM设计思路

