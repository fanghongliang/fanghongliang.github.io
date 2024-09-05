---
title: ES6
tags: Javascript
categories: Javascript
date: 2021-04-13 19:18:29
---


## node版本管理  

不同项目交叉开发时，可能会出现node版本的冲突，常见有 nvm 插件来解决，但 nvm 并不是全自动，需要手动切换版本 nvm use ...  ，这里采用社区提供的 avn (avn)[https://github.com/wbyoung/avn],思路为： 项目根目录下创建 .node-version文件，以 server 格式约定好 Node 版本，如： 9.8.0，在CD到项目目录时，avn会自动切换到制定的Node版本。  

## n命令  

n命令来管理node的不同版本，基本为 

```
$ npm i -g n
$ n ls-remote --all    // 查看所有可安装的版本
$ n <version>          // 安装node，ex: n 10.15.0
$ n ls                 // 本地已安装的版本
sudo n run <version>      // 使用某个版本
n                      // 直接n 也可以选择版本

sudo n rm <version>    // 删除多余的版本

```  

简单说下优缺点吧   
优点： 方便，快速，相对avn来说， n命令安装方便，一条命令解决，avn则需要改IP地址或者科学上网等，   
缺点： 这版本是全局且手动的，自己的项目可以用用，要是大型开发项目，建议用nvm编写 script 启动命令来控制版本，否则项目之间可能出现node版本冲突。  
PS： n 命令大部分都需要使用 sudo 打开  


## 数组移除false类型  
简单记录一个数组的移除 false 方法  
```javascript
const arr = [1, "str", false, NaN, undefined, null]
const res = arr.filter(Boolean)

// React
const hideSomething ?: boolean
const options: any = [
    hideSomething !== true && {
        otherOption: 'test'
    },
    {
        normalOptions: 'normal'
    },
].filter(Boolean)

```


## 解构附值log

```javascript

const { log, warn } = console
log('something')

```