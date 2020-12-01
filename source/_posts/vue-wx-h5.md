---
title: vue-wx-h5
tags: Programming
categories: Vue
date: 2019-12-30 10:47:44
---

### 微信公众号总结
由于微信的约定，在ios端无法购买虚拟产品，安卓则没有限制。为了解决ios用户也可以享受购买虚拟服务的问题，可适用公众号H5支付来解决ios端支付问题
### 准备
由于仅仅是为ios用户解决支付问题，故此H5页面内容很简单，登录、拉取支付列表、支付即可。H5采用vue+jq实现，未适用vue-cli。（就俩页面，没必要）。页面结构如下： 

[![image.png](https://i.postimg.cc/sx70hyYX/image.png)](https://postimg.cc/ct1cpp5y)  

### 鉴权需求
鉴权，是微信提供的H5授权方式，一般采用第三方授权，授权成功获取code，用code获取acces_token、unionID等，由于H5是小程序ios支付的延伸，故此需要unionID来判断用户唯一性！鉴权必不可少。  
index.html文件中首先导入jsapi  

### 鉴权
网页授权与小程序不同，网页是第三方网页授权，然后授权信息在重定向链接中（redirect_uri）返回，重定向链接我设置为index.html页面。  
在 created（） 钩子中，去鉴权获取code  
```javascript
created: function() {
    const token = window.sessionStorage.getItem('token')  //解决刷新问题
    if(token) {
        this.getCircleList() 
        return 
    }
    let c = this.getQueryCode('code')  
    this.code = c
    if(this.code) {
        this.postData(c)
    } else {
        this.getUserCode()
    }  
},
//鉴权
getUserCode() {
    let redirect_uri = 'http://test.********.cn/projectName/' 
    redirect_uri = encodeURI(redirect_uri)
    let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirec`
    window.location.href = url
},
//获取鉴权成功后code
getQueryCode(variable) {
    let query = window.location.search.substring(1)
    let v = query.split("&")
    for(let i = 0; i < v.length; i++) {
        let pair = v[i].split('=')
        if(pair[0] == variable) {
            return pair[1]
        }
    }
    return null
},
```
重点在于 *getUserCode* 鉴权函数,有人会在鉴权链接后面再加一个参数：*&connect_redirect=1* 我第一次使用的链接就是加了该参数的，我只替换了APPID和重定向地址，结果一直报错，坑货。  
第二，重定向链接不能是本地连接，得是外网可以访问的链接。

### 支付

页面中点击单个商品，进行支付购买。具体的支付过程和小程序支付一样，只不过这里多了wx.config 的应用。
```javascript
    wx.config({
        debug: false,
        appId: that.appId,
        timestamp: timeStamp1,
        nonceStr,
        signature,
        jsApiList: ['chooseWXPay'] 
    })
    wx.ready(function() {
        wx.chooseWXPay({
            timestamp: timeStamp1,
            nonceStr,
            package: package1,
            signType,
            paySign,
            success: function (res) {
                that.showSuccTip = true
                that.clickStatus = true
                that.getCircleList()
                setTimeout(() => {
                    that.showSuccTip = false
                }, 1000*3)
            },
            cancel() {
                that.clickStatus = true
            },
            fail(res) {
                alert('支付失败,稍候再试')
                that.clickStatus = true
            },
        });    
    })
    wx.error(function(res) {
        console.log('config error : ', res)
    })
```

### 页面通信 - ajax
没有使用axios,使用ajax通信，封装ajax通信
```javascript
httpAjax (obj) {
    $.ajax({
        url: obj.url,
        data: obj.data && obj.type === "POST" ? JSON.stringify(obj.data) : obj.data,
        type: obj.type ? obj.type : 'GET',
        contentType: 'application/json',
        beforeSend: function(xhr) {
            if (obj.token) {
                xhr.setRequestHeader('Authorization', '******** ' + obj.token);
            }
        },
        dataType: 'json',
        success: function (res) {
            if (typeof obj.success === 'function') {
                obj.success(res)
            }
        },
        error: function (res) {
            if (typeof obj.error === 'function') {
                obj.error(res)
            }
        }
    })
},
```
### 页面效果
[![image.png](https://i.postimg.cc/DfYGNZJk/image.png)](https://postimg.cc/t7W7Z9N2)
这个效果，想到了使用jq解决，vue可能有更简单的方法，但没试过！
```javascript
data: {
    clickId: 0,  
}
//列表按钮携带自身id
showDetail(id) {
    if(id == this.clickId) return 
  
    $('#'+this.clickId).addClass('contentBox')
    $('#'+id).removeClass('contentBox')

    $('#'+id).find("[name='bigCircle']").removeClass('greyLine')
    $('#'+this.clickId).find("[name='bigCircle']").addClass('greyLine')

    $('#'+id).find("[name='smallCircle']").addClass('hited')
    $('#'+this.clickId).find("[name='smallCircle']").removeClass('hited')

    this.clickId = id
},

```
### 采坑

#### 杂谈
坑真的有点多，尤其是第一次搞得话。各种配置文件、微信公众平台里面的白名单，安全域名配置等等，token的传递坑了好久，跨域，没用vue-cli ，打开页面不能右击打开浏览器预览，使用 anywhere 插件来把路径转化为 http/HTTPS链接，后期测试直接把文件拉倒xshell服务器里面去测，要不Git分支被污染的不忍直视。 
#### ios兼容 
ios端用户支付成功回调函数里面 alert 并不会被执行，Android则无影响。所以支付成功的提示自己写一个 alert 就可以。
#### 刷新
都快上线了，产品进入点了一个刷新，页面卡死报错！原因是鉴权返回的 code  一次性有效！，刷新时，链接其实没变，但是code已经过期了。  
解决： 页面刷新不影响逻辑，此时我们只需要token即可，故此把token存储在sessionStorage 里面即可避免页面刷新问题。
