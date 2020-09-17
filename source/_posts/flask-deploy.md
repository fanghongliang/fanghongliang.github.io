---
title: 服务器部署-flask
tags: 默认
categories: 默认
date: 2020-09-17 11:57:54
---

#### 前言  

centos 系列的云服务器一般自带Python3.6，使用如下命令查看Python是否提前安装  

> whereis python

服务器的基本配置可参考之前的 [服务器部署-Node](http://fanghl.top/2020/06/09/server/#more) 一文  

工具： 

* 云服务器
* Xshell
* Navicat
* Postman

#### 虚拟环境

本地测试跑通的项目，生成 requirement.txt 或 Pipfile文件，通过Xshell导入到服务器目录下，使用 pipenv install 创建虚拟环境，并安装依赖。


#### 安装依赖异常  

这里常见的报错为安装超时 timeout ， pip 可以指定安装源。  

* 阿里云 http://mirrors.aliyun.com/pypi/simple/ 
* 中国科技大学 https://pypi.mirrors.ustc.edu.cn/simple/ 
* 豆瓣(douban) http://pypi.douban.com/simple/ 
* 清华大学 https://pypi.tuna.tsinghua.edu.cn/simple/ 
* 中国科学技术大学 http://pypi.mirrors.ustc.edu.cn/simple/

临时指定安装源  
>  pip install -i https://pypi.tuna.tsinghua.edu.cn/simple

永久指定安装源  

* linux  修改 ~/.pip/pip.conf (没有就创建一个)， 内容如下
> [global]
> index-url = https://pypi.tuna.tsinghua.edu.cn/simple

* windows  直接在user目录中创建一个pip目录，如：C:\Users\xx\pip，新建文件pip.ini  
> [global]
> index-url = https://pypi.tuna.tsinghua.edu.cn/simple

#### 服务器运行  

依赖都已经导入后，尝试运行项目的入口文件，如果报错，请先解决错误。  

如果没有错误，此时的项目运行在 localhost:5000 端口，我们在外部是无法访问的，我们修改项目入口文件host: 

```python 
if __name__ == "__main__": 
    app.run(host="0.0.0.0", port=5000, debug=True)
```
来监听所有的端口请求。

#### 端口安全组

项目监听0.0.0.0，却在外面还是无法访问！
使用 nmap your ipAddress 来查看开放的接口，这里5000端口是不存在的，
eg: nmap 108.16.12.26  

5000端口未被开放，可以使用防火墙命令开启5000端口，防火墙命令见 [服务器部署-Node](http://fanghl.top/2020/06/09/server/#more)   

开启了防火墙之后，如果可以访问5000端口了，那么恭喜你。
如果防火墙开启5000端口或者关闭防火墙依然无法访问，那么这里需要去云服务器找到安全组 -> 创建安全组 -> 允许访问所有端口，之后在创建好的安全组，点击进去看到 关联云服务器 ，选择你的服务器实例即可。如此，我们在外网访问到程序

#### gunicorn gevevnt  

可以访问项目后，当关闭 Xshell 后，项目仍然无法被访问，所以这里使用 gunicorn 来做持久访问。

安装gunicorn gevevnt， gevent 对Windows兼容不是很好。  

pip install gunicorn gevevnt  

安装好之后，在项目根目录建立 gunicorn.conf.py  内容如下：  

```
workers = 5    # 定义同时开启的处理请求的进程数量，根据网站流量适当调整
worker_class = "gevent"   # 采用gevent库，支持异步处理请求，提高吞吐量
bind = "0.0.0.0:5000"
```

使用命令部署项目  

> gunicorn run:app -c gunicorn.conf.py     # run:app 这里的 run 是你项目入口文件

启动后，关闭 Xshell 后依旧可以访问  

#### 重启和关闭  

* 查看进程  

得到的结果包含正在运行的进程和我们之前配置的线程数，这里操作的是进程。

> pstree -ap|grep gunicorn

> kill -9 pid   # 关闭进程

> kill -HUP pid  # 重启进程


#### docker容器部署





