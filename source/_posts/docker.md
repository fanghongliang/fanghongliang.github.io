---
title: Docker排查Grafana日志
tags: 腾讯云
categories: 每周一文
date: 2024-08-11 16:31:54
---


### 前言


### 排查Grafana问题  

背景： 在整合公司Grafana插件中，遇到了请求报502的问题，这里借助Grafana日志以及docker命令来排障

由于版本便利，我们在docker中启动了Grafana,而Grafana的可以在conf/grafana.ini 中开启debug日志,通常日志存储在grafana安装目录下logs中，但docker中启动grafana，日志可以在docker容器中查看

```sh

# 查看运行的容器，获取容器name或id
docker ps 

# 查看具体日志
docker logs <container_id_or_name>

```


