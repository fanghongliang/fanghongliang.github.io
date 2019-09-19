---
title: Git 
date: 2019-09-11 11:43:41
tags: 
categories: Git 
---

### desc : 根据实际业务遇到的情况总结一个Git处理问题手册，包括但不限于分支新建、分支合并、分支合并冲突、dist文件冲突、版本回退等。

#### 命名规范
| 标记   |  解释  |
| ---- | ----  |
| feat  | 新功能  |  
| fix   | 修补bug |  
| docs  | 文档    |  
| style | 格式，不影响代码 |  
| refactor | 重构，不添加新功能，也非修补bug |  
| test  | 增加测试 |  
| chore | 构建过程或辅助工程变动 |  
| scope | 用于说明commit影响的范围 |



#### Vue-dist冲突：
在分支上解决业务之后需要merge到master分支，master分支已经被人在其他分支写了业务并merge过了，我们此时merge到master上，git pull 拉下来最新的代码，在进行merge，必然会冲突。index.htlm 打包文件会冲突。  
解决： 在master分支上，保留自己的 index.html 文件，提交。冲突的其他文件也一并提交，之后一定要再次 build master分支！！！！！，否则，你的index.html 打包文件是不包含别人的业务的。


#### 修改文件大小写
Windows对大小写不敏感，git对大小写不敏感，需要修改文件名的大小写，实际修改了git却不会生效的，解决：  
1. 复制此文件到其他地方备份
2. 删除项目中的该文件
3. 提交代码
4. 重新添加此文件到项目
5. 提交代码，over

#### git stash
想要切换分支，本地却已经做了改变。切换会报错，此时可以使用 *git stash*保存当前的修改，等处理完其他分支事务在回来‘取出保存’的修改即可。    

| 命令   |  作用说明  |
| ---- | ---- | 
| git stash | 保存当前工作区和暂存区的修改 |
| git stash save '注释信息' | 作用同上，加上了注释信息方便区分 |
| git stash list | 查看保存列表 |
| git stash pop  | 恢复最近一次保存并删掉保存列表的记录，只恢复工作区 |
| git stash pop --index | 与上面命令的效果一样但是还会恢复暂存区！ |
| git stash pop stash@{序号} | 恢复保存列表里指定的保存记录，并把恢复的记录从保存列表中删除 |
| git stash apply | 恢复最近的保存记录但不会删除保存列表里面对应的记录 |
| git stash drop | 删除保存列表里面最近一条保存记录。后面加 stash@{序号}可以删除指定的保存记录 |
| git stash clear | 删除保存列表里面所以保存记录（清空保存列表）|
| git stash 分支名 stash@{序号} | 修改了文件，此次修该使用了 *git stash* |  

保存，然后继续修改了该文件，此时再用 *git stash pop* 或 *git stash apply* 恢复之前的保存，可能会出现冲突。此时使用该命令会创建一个分支然后在创建的分支上把保存的记录恢复出来，避免冲突。

PS ： *git stash* 保存的修改可以跨分支应用。例如：在 *develop*分支上做了修改， *git stash*保存，切换到 *master* 分支，使用 *pop* 或 *apply* 拉出来保存，这样就可以把 *develop* 分支上修改的内容迁移到 *master* 上，解决冲突可能会遇到。  

#### git 部分命令

| 命令 | 作用说明 |  
| ---- | ---- |
| git reset HEAD | 放弃暂存区的修改（已经add,未commit） |
| git checkout -- * | 放弃本地修改（未commit） |
| git reset --soft HEAD^ | 撤销commit |
| git checkout -b dev | 创建dev分支 |
| git branch -d dev | 删除dev分支 |


#### 撤销线上仓库的push

适用于错误的push后没有他人再次push
```
$ git reset --soft <commitHash>
$ git push --force 
```