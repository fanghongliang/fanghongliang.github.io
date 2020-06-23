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

```
#  mysql -h 127.0.0.1 -u root
#  mysql>use mysql;
#  mysql>update user set host = '%' where user ='root';
#  mysql>select host, user from user;
#  mysql>flush privileges;  

```  

#### mysql异常集合  

运行程序mysql报错 `(node:6280) UnhandledPromiseRejectionWarning: SequelizeDatabaseError: Illegal mix of collations (latin1_swedish_ci,IMPLICIT) and (utf8mb4_unicode_ci,COERCIBLE) for`，原因为sequelize创建的mysql默认字符集是 `latin1` 而不是 *utf8*，更改即可。  

#### nmap    
使用该命令查看服务器开放的端口，查看3306端口是否防火墙中允许访问。  

yum -y install nmap
nmap 192.168.1.56

#### telnet  
检查我们的IP是否可以ping同 例如telnet 192.168.157.129 80

#### 防火墙端口  
express程序默认运行在 3000 端口，云服务器默认是没有开放 3000 端口的，需要我们手动开启 3000 端口，命令如下：   

`firewall-cmd --zone=public --add-port=3000/tcp --permanent`
重启防火墙  
`firewall-cmd --reload`  

如报错FirewallD is not running,则开启防火墙  
`systemctl start firewalld`

使用nmap查看现在的端口情况，3000端口已经开启。 
`nmap yourIpAddress`

#### pm2进程管理  
本地服务在我们关闭命令窗口后会停止服务，使用pm2 管理我们的服务，本地调试好之后传到git，Xshell中直接拉取最新代码，进入项目根目录，使用pm2管理进程，即使我们关闭xshell，服务依然还在跑。  
[![BA983203-9-F7-C-4c28-A895-5-FCEBD8699-E7.png](https://i.postimg.cc/W1czCSL1/BA983203-9-F7-C-4c28-A895-5-FCEBD8699-E7.png)](https://postimg.cc/7fXqT3ZF)  
1、pm2需要全局安装
npm install -g pm2
2、进入项目根目录
2.1 启动进程/应用 pm2 start bin/www 或 pm2 start app.js

2.2 重命名进程/应用 pm2 start app.js --name wb123

2.3 添加进程/应用 watch pm2 start bin/www --watch

2.4 结束进程/应用 pm2 stop wwwb

2.5 结束所有进程/应用 pm2 stop all

2.6 删除进程/应用 pm2 delete www

2.7 删除所有进程/应用 pm2 delete all

2.8 列出所有进程/应用 pm2 list

2.9 查看某个进程/应用具体情况 pm2 describe www

2.10 查看进程/应用的资源消耗情况 pm2 monit

2.11 查看pm2的日志 pm2 logs

2.12 若要查看某个进程/应用的日志,使用 pm2 logs www

2.13 重新启动进程/应用 pm2 restart www

2.14 重新启动所有进程/应用 pm2 restart all

2.15 监听修改，自动重启 pm2 start xxx --watch

#### nginx代理  

安装nginx，链接： https://www.cnblogs.com/shiyuelp/p/11945882.html  
路径： /usr/local/nginx/sbin  
配置文件修改：/usr/local/nginx/config  
注意点： nginx默认在80端口，而服务器默认不开放80端口。需要手动打开80端口。  
查看nginx是否启动成功：  ps aux|grep nginx;
检查IP是否可以ping通： telnet 106.13.4.74 80；
启动nginx： /usr/local/nginx/sbin/nginx  
重启nginx： /usr/local/nginx/sbin/nginx -s reopen
关闭nginx： /usr/local/nginx/sbin/nginx -s stop  

配置文件可以自己修改  

#### 域名映射  

域名映射这块其实没必要单独再买一个域名，如果自己有域名的话，可以用一个二级域名来代替。这里以阿里云的域名为例。在阿里云的域名解析设置中，添加一个记录，主机记录那里就是填写我们
二级域名的地方，记录值填写服务器的IP地址，添加完成后即可使用域名访问服务器了。可以直接在浏览器输入刚刚配置二级域名，看看是否有nginx欢迎页即可。  
[![BA983203-9-F7-C-4c28-A895-5-FCEBD8699-E7.png](https://i.postimg.cc/1XrsSZ9P/BA983203-9-F7-C-4c28-A895-5-FCEBD8699-E7.png)](https://postimg.cc/QKCRgw9n)

#### redis  
