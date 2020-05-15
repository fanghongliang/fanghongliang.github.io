---
title: Git 
date: 2019-09-11 11:43:41
tags: Programming
categories: Git 
---

#### Git实用命令总结
总结了部分开发中常用的git操作命令，根据实际业务遇到的情况梳理。包括但不限于分支新建、分支合并、分支合并冲突、dist文件冲突、版本回退等。  
####  命名规范
| 标记   |  解释  |
| ---- | ----  |
| feat  | 新功能  |  
| fix   | 修补bug |  
| doc  | 文档    |  
| style | 格式，不影响代码 |  
| refactor | 重构，不添加新功能，也非修补bug |  
| test  | 增加测试 |  
| chore | 构建过程或辅助工程变动 |  
| scope | 用于说明commit影响的范围 |

#### 问题解决

##### 修改文件大小写
Windows对大小写不敏感，git对大小写不敏感，需要修改文件名的大小写，实际修改了git却不会生效的，解决:
    1. 复制此文件到其他地方备份
    2. 删除项目中的该文件
    3. 提交代码
    4. 重新添加此文件到项目
    5. 提交代码，over

#### git实用命令
##### git stash
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

保存，然后继续修改了该文件，此时再用 *git stash pop* 或 *git stash apply* 恢复之前的保存，可能会出现冲突。此时使用该命令 *git stash 分支名 stash@{序号}* 会创建一个分支然后在创建的分支上把保存的记录恢复出来，避免冲突。

PS ： *git stash* 保存的修改可以跨分支应用。例如：在 *develop*分支上做了修改， *git stash*保存，切换到 *master* 分支，使用 *pop* 或 *apply* 拉出来保存，这样就可以把 *develop* 分支上修改的内容迁移到 *master* 上，解决冲突可能会遇到。  

##### git撤回文件


| 命令 | 作用说明 |
| ---- | ---- |
| git reset HEAD | 放弃暂存区的修改（已经add,未commit） |
| git checkout -- * | 放弃本地修改（未commit） |
| git reset --soft HEAD^ | 撤销commit |


##### 撤销线上仓库的commit
适用于错误的push后没有他人再次push
```
$ git reset --soft <commitHash>
$ git push --force 
```
##### git revert
撤销几次之前的commit，又需要保留该commit之后的提交时，需要用到 revert
```
$ git log 
$ git revert commit_hash
$ git push 
```
git reset 本质即把指针 HEAD 指向某一个 commit   
git revert 本质不算是回滚，是反做，反向操作commit。正常情况下，每一次操作文件后会让 Git 时间线往前走一步，revert反向操作某一个commit 记录，并生成一个新的  commit 来反做   

#### 配置别名 

长命令的别名配置
```
$ git config --global alias.st status
```
一个比较实用的别名配置↓  
```
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```
每个仓库的Git配置文件都放在.git/config文件中
```
$ cat .git/config 
```
```
[branch "master"]
    remote = originq
    merge = refs/heads/master
[alias]
    last = log -1       //命令作用区域
```
配置别名也可以直接修改这个文件↑

#### 新建分支作业  
修改bug、添加新功能等，在主分支上开一个新分支进行作业，待作业完成后，再合并回主分支，并删掉新开的分支。  
##### 方法一：  
```
master分支
$ git checkout master 
$ git checkout -b xqcircle origin/xqcircle     //创建新分支并关联在远程同名分支上
$ git push origin HEAD                         //把该分支推送到远程，即可以在git仓库看到
```
##### 方法二：  
```
$ git branch dev 
$ git branch -a
$ git branch -b branch_name                     //本地先创建该分支
$ git push --set-upstream origin branch_name    //本地分支推送到远程同名分支，且本地分支会自动track该分支
```
##### 拉取分支
远程存在分支，本地没有该分支，用以下命令拉下来
```
$ git checkout --track origin/branch_name 
```
##### 合并回主分支
```
$ git checkout master
$ git merge branch_name
```
##### 删除远程分支
```
$ git branch -r -d origin/branch_name          
$ git push origin :branch_name
```
##### 删除本地分支
```
$ git branch -d branch_name
$ git branch -D branch_name
```

#### 标签tag
一个版本上线定义一个版本标签，方便快速回退该版本。
```
git tag               //列出所有tag
git tag -r            //查看远端所有分支
git tag -l 'v2.0.1'   //过滤tag
```
##### 新建tag 
```
git tag xqCircle-v2.0.0   
```

##### 查看tag，commit号
```
git show tagName 
```

##### 给某个commit打上tag
```
git tag -a v1.0.0 commitId -m 'my tag'
```

##### 推送tag到服务器
```
git push origin tagName    //推送某个具体tag
git push origin --tags     //推送本地所有tags
```

##### 切换到某个tag
跟分支一样，可以直接切换到某个tag去。这个时候不位于任何分支，处于游离状态
```
git checkout xqCircle-v2.0.1
```

##### 切换到某tag并新建分支
```
git checkout -b branchName tagName
```

#### 删除tag
```
git tag -d xqCircle-v2.0.1    //本地删除
git push origin :refs/tags/xqCircle2.0.1   //远端删除
```