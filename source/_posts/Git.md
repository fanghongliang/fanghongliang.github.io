---
title: Git 
date: 2019-09-11 11:43:41
tags:
---

### desc : 根据实际业务遇到的情况总结一个Git处理问题手册，包括但不限于分支新建、分支合并、分支合并冲突、dist文件冲突、版本回退等。

#### dist冲突：
在分支上解决业务之后需要merge到master分支，master分支已经被人在其他分支写了业务并merge过了，我们此时merge到master上，git pull 拉下来最新的代码，在进行merge，必然会冲突。index.htlm 打包文件会冲突。  
解决： 在master分支上，保留自己的 index.html 文件，提交。冲突的其他文件也一并提交，之后一定要再次 build master分支！！！！！，否则，你的index.html 打包文件是不包含别人的业务的。


#### 文件大小写
Windows对大小写不敏感，git对大小写不敏感，需要修改文件名的大小写，实际修改了git却不会生效的，解决：  
1. 复制此文件到其他地方备份
2. 删除项目中的该文件
3. 提交代码
4. 重新添加此文件到项目
5. 提交代码，over
