---
title: 服务器部署
tags: Programming
categories: server
date: 2020-06-09 11:28:31
---

#### 配置服务器  
购买的服务器，属于一个空壳子，安装我们需要的Git、node等程序，使用Xshell进行控制。  

#### Git连接仓库  
1. 生成秘钥，并将公钥注册在Git仓库即可 `cd ~/.ssh`

#### 安装MySQL  
1. 目录切换至root下， cd ~  

2. 下载与安装mysql, 步骤如下    

1. 安装MySQL官方的yum repository： `wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm`  

2. 下载rpm包 `yum -y install mysql57-community-release-el7-10.noarch.rpm`  

3. 安装MySQL服务 `yum -y install mysql-community-server`,需要等待一段时间，最后出现 complete！  

4. 启动MySQL服务 `systemctl start mysqld.service`  

5. 查看MySQL状态 `systemctl status mysqld.service`  

6. 获取初始密码 `grep "password" /var/log/mysqld.log`,复制下来，待会修改密码要用到  

7. 登录MySQL `mysql -u root -p`，执行后输入刚刚复制的密码即可登录成功，成功后会展示MySQL的版本信息，这里是5.7.X  

8. 执行MySQL语句 `set global validate_password_policy=0;set global validate_password_length=1;`之后才可以修改密码（这里是5.7版本的修改密码方法）  

9. 修改MySQL密码 `set password for root@localhost = password('123456');` root是用户名，可自定义。  

10. 退出使用新密码重新登录  

11. 配置mysql，在etc/目录下,编辑（不存在则新建）my.cnf文件，重启MySQL  

12. 配置用户，使得root用户在外网也可以访问到mysql，
    ```mysql
    #  mysql -h 127.0.0.1 -u root
    #  mysql>use mysql;
    #  mysql>update user set host = '%' where user ='root';
    #  mysql>select host, user from user;
    #  mysql>flush privileges;
    ```
