---
title: 'hexo'
date: 2019-09-19 20:43:17
tags: Programming
categories: Hexo
---

#### 基础命令
新建页面： `$ hexo new page <pageName>`  
测试发布： `$ hexo s`  
正式发布： `$ hexo d -g`  
清除缓存： `$ hexo clean`  
  


#### 页面丰富

##### 公益404：
`$ hexo new page 404`  
进入 \source\404\index.md 添加：  
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