---
title: 'Hexo建站'
date: 2019-09-19 20:43:17
tags: Programming
categories: Hexo
---
#### 序言
NEXT主题： <http://theme-next.iissnan.com/getting-started.html>  
参考文章： <https://blog.csdn.net/sinat_37781304/article/details/82729029>    
next参考: <https://www.jianshu.com/p/5e56839ef917>  
步骤：  
```
安装Git
安装Node.js
安装Hexo
GitHub创建个人仓库
生成SSH添加到GitHub
将hexo部署到GitHub
设置个人域名
发布文章
```

#### 安装
`$ npm install hexo-cli -g`   
安装后检查是否安装成功：   
`$ hexo -v`  
成功后进行初始化：   
`$ hexo init myBlog`  
安装组件:  
```
$ cd myBlog
$ npm install
```  
至此，新建完成！目录会存在以下结构：  
```
node_modules: 依赖包
public：存放生成的页面
scaffolds：生成文章的一些模板
source：用来存放你的文章
themes：主题
** _config.yml: 博客的配置文件**
```
查看刚刚创建的hexo博客：
```
$ hexo g
$ hexo s
```
打开localhost:4000就可以看到啦

#### 创建GitHub仓库

创建一个和你用户名相同的仓库，后面加.github.io，只有这样，将来要部署到GitHub page的时候，才会被识别，也就是xxxx.github.io，其中xxx就是你注册GitHub的用户名


#### hexo部署到GitHub
将hexo和GitHub关联起来，也就是将hexo生成的文章部署到GitHub上，打开站点配置文件 _config.yml，翻到最后，修改为
```
deploy:
  type: git
  repo: https://github.com/YourgithubName/YourgithubName.github.io.git
  branch: master
```
此时需要安装deploy-git ，也就是部署的命令,这样你才能用命令部署到GitHub  
```
$ npm install hexo-deployer-git --save
```
然后：  
```
$ hexo clean
$ hexo generate
$ hexo deploy
<!-- 或者简化命令如下 -->
$ hexo clean
$ hexo d -g
```
其中 deploy 时会要求输入 username 和 password （git账户密码）  
之后，打开 http://yourname.github.io 这个网站就可以看到你的博客了！！

#### 发布博客

和线上GitHub关联后，新增一篇博客：  
`$ hexo new post <your blogName>`  
  
编辑好文章发布部署：  
`$ hexo d -g `
清除缓存：  
`$ hexo clean`
#### 本地启Hexo动服务
`$ hexo s || hexo serve`  
默认端口：4000，修改端口号：  
`$ hexo serve -p 5000`

#### 草稿

#### 页面丰富

##### 公益404：
`$ hexo new page 404`  
进入刚才生成的 \source\404\index.md 添加：  
```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>404</title>
	</head>
	<body>
		<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>
	</body>
</html>
```

##### tags/标签页  
`$ hexo new page tags`  
配置tags页面，进入到刚才生成的 \source\tags\index.md文件，添加type字段：  
```
title: 标签
date: 2019-09-19 19:49:32
type: "tags"
```
在文章中设置对应的标签即可：  
```
tags: [xxx,xxx,xxx]
```

##### 分类页面/categories 
`$ hexo new page categories`  
配置categories页面，进入到刚才生成的 \source\categories\index.md文件，添加type字段：  
```
title: 分类
date: 2019-08-19 15:11:42
type: "categories"
comments: false
```
设置每篇博客的 categories：  
`categories: xxx`

#### 功能点
##### 字数统计、时长
主题配置文件 _config.yml 中打开 wordcount 统计功能即可  
```
post_wordcount:
  item_text: true
  wordcount: true     #字数统计
  min2read: true      #阅读时长
  totalcount: true
  separated_meta: true
```
配置之后还是没出现字数统计和阅读时长，可能是因为未安装 hexo-wordcount 插件，安装即可：  
`$ npm insatll --save hexo-wordcount`  
重启服务，OK

##### 站内搜索
安转插件  
`npm install hexo-generator-searchdb --save`  
hexo站点配置文件_config.yml,任意位置手动添加：  
```
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
```
修改主题(next)配置文件_config.yml,启用local_search  
```
local_search:
  enable: true
  trigger: auto
  top_n_per_article: 1
```
ok 


#### GitHub page 404  

已经部署好的hexo,在我们修改了git仓库的属性之后（我是切换了仓库的公开和私有属性），再次访问域名就会 page 404，检查了仓库文件和本地hexo配置文件，均未改动。  

> 解决： 在线上git仓库的setting中，选择theme-> Custom domain,在这里重新输入你的域名，保存即可，重新打开域名，页面已经回来了。hexo的域名绑定是双向的！  



hugo博客框架： go语言编写。多线程编译。速度快