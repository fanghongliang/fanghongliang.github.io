---
title: Emmet
tags: Programming
categories: html
date: 2019-10-11 13:53:19
---
#### Emmet功能
快速编辑前端HTML标签，以及编辑器标签自动闭合功能  
编辑器安装插件：`Auto Close Tag`  
Vscode编辑器中，【设置】中打开 Emmet相关配置  

#### Emmet
##### 初始化
```
! => tab
html:5
```

##### 标签id/class/属性
```
div.test#testid
p.test-class{这里是p文本}
```
##### 嵌套
< : 子节点  
\+ : 兄弟节点  
^ : 父节点
```
div.aim-class>div.son-class^div.brother1-class+div.brother2-class
```

##### 分组
() : 分组  
分组内的标签在层级上视为整体
```
div>(div>div>a)+div>p{test text}
```
##### 隐式标签
直接通过 类 或 ID 生成标签  
可以省略掉div，即输入.item即可生成`<div class="item"></div>`  
隐式标签集合： 
```
li：用于ul和ol中
tr：用于table、tbody、thead和tfoot中
td：用于tr中
option：用于select和optgroup中
```
##### 乘法
\* : 重复指令  
$ : 自增符号
```
div*5
ul>li$*3
```

##### CSS缩写 
```
w100     => width: 100px
h10p     => height: 10%
```
单位别名列表:  
p 表示%  
e 表示 em  
x 表示 ex  

更多参考： <https://blog.csdn.net/comphoner/article/details/79670148>