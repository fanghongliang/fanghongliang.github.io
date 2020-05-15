---
title: wepy-封装 
tags: Programming
categories: wepy框架封装
date: 2019-12-16 14:48:03
---

### request封装

目录结构： [![l-ALPDg-Q9r-WOLkx-DNAd-PM5-A-228-467.png](https://i.postimg.cc/wvd8zRCv/l-ALPDg-Q9r-WOLkx-DNAd-PM5-A-228-467.png)](https://postimg.cc/Lqv0B56K)

目录： /utils/base.js
```javascript
import wepy from 'wepy'
import qiniuyun = from '@/utils/qiniuUploader'
const dev = false
const baseUrl = dev ? 'https://xxxx' : 'https://test/xxx'
//上传图片： 
const uploadImg = (imageURL, uptokenURL) {
    return new Promise((resolve, reject) => {
        qiniuyun.upload(imageURL, res => {
            resolve(res)
        }, error => {
            reject(error)
        }, {
            region: 'ECN',
            domain: 'https://xxxx',
            uptoken: uptokenURL
        })
    }) 
}
//请求封装
const wxRequest = async (params = {}, url, method,) => {
    let token = params.token || ''
    if(params.getToken) {
        token = wepy,getStorageSync('token')
    }
    let res = await wepy.request({
        url,
        method: methos || 'GET',
        data: params.data || {},
        header: Object.assign({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `str**Token ${token}`
        }, params.header || {})
    })
    return res
}

module.exports = {
  wxRequest,
  baseUrl,
  uploadImg,
};
```

在 *base.js* 中封装请求，在api文件中则可以直接拿来使用
目录： utils/api.js
```javascript
import base from '@/utils/base'

//登录、获取基本信息
const login = (params) => base.wxRequest(params, `${base.baseUrl}/login/`, 'POST')
const getUserInfo = (params) => base.wxRequest(params, `${base.baseUrl}/user/`,)

module.exports = {
    login,
    getBaseInfo,
}
```
统一管理维护所有的接口api， 在页面中，直接使用具体的api 
```javascript
/*
* src/pages/index.wpy
*/
import api from '@/utils/api'

//获取用户基本信息
onShow() {
    this.getUserInfo(params)
}
//带参数，同步写法
getUserInfo(params) {
    api.getUserInfo({
        data: {
            data: data1
        },
        getToken: true
    }).then(res => {
        const data = res.data
        ...
        this.$apply()
    })
}
//不带参数，异步写法
async getUserInfo() {
    let res = await api.getUserInfo({getToken: true})
    if(res.statusCode === 200) {
        //doSth
    }
}
```

### Mixins 
提出公共方法，方便全局调用
```JavaScript
/*
*path: scr/mixins/common
*name: common
*/
import wepy from 'wepy'
export default class commonMixins extends wepy.mixins {
    //本地存储
    saveData (k, v) {
        wepy.setStorage({
            key: k,
            value: v
        })
    }
    saveDataS(k, v){
        wepy.setStorageSync(k, v || '')
    }
    getDataS(k){
        let res = wepy.getStorageSync(k);
        return res
    }
    // 图片预览
    preImg(c, u){
        wepy.previewImage({
            current: c,
            urls: u
        })
    }
    // 提示框
    toast(title,icon,dura){
        wepy.showToast({
            title: title,
            icon: icon,
            duration: dura || 1500
        })
    }
    //页面滚动
    pageScro(num){
        wepy.pageScrollTo({
            scrollTop: num,
            duration: 0
        });
    }
    // 页面跳转
    nav(url){
        this.$navigate({
            url: url
        })
    }
    swi(url){
        wepy.switchTab({
            url: url
        })
    }
    log() {
        const show = true
        if (show) {
            console.log(`[${new Date().Format("yyyy-MM-dd hh:mm:ss")}] `, ...arguments)
        }
    }
    // 发送formid(已废弃)
    postFormId(id){
        let arr = wepy.getStorageSync('form_ids') || [];
        arr.push(id);
        wepy.setStorageSync('form_ids', arr)
    }
    // showModal
    modal(data) {
		wx.showModal({
			content: data.content,
			showCancel: data.cancel || false,
			confirmText: data.confirm || '知道了',
		})
    }   
    //粘贴板
    setClipboardData(data, succFun) {
        wx.setClipboardData({
            data: 'data',
            success(res) {
                wx.getClipboardData({
                    success (res) {
                        succFun
                    }
                })
            }
        }) 
    }
    // 页面顶部title 
    setNavTitle(title) {
        wx.setNavigationBarTitle({
            title: title
          })
    }
    //跳转小程序
    navToMini(appId) {
        wx.navigateToMiniProgram({
            appId,
        })
    }
    //加载框
    loading(title) {
        wx.showLoading({
            title: title || "加载中..."
        })
    }
    //隐藏加载框
    hideLoading() {
        wx.hideLoading({})
    }
    //banner跳转
    bannerJump(url) {
        if(url.slogan == 1) {
            this.swi(url.autoResponse1)
            return 
        }
        this.nav(url.autoResponse1)
    }
    //返回上一个页面
    navBack() {
        wx.navigateBack({})
    }
}
```
使用mixins ，在页面中引入，config中声明，即可在页面使用 this  调用
```javascript 
import commonMixin from '@/mixins/common'
import req from '@/mixins/req'
 
//页面配置中： 
mixins = [commonMixin, req]
```

### 常量配置数据
前端配置数据抽离出来单独放，便于维护。
```javascript
/**
*path: src/utils/configData.js
*/
const education = [
    '高中及以下',
    '专科',
    '本科',
    '硕士',
    '博士',
]
//微信号码正则
const wxreg=/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
// banner轮播配置
const swiperConfig = {
    autoplay: true,         
    interval: 3500,         
    duration: 500,    
    circular: true,
    indicatorDdots: true,
    indicatorColor: 'rgba(255,255,255,1)',
    indicatorActiveColor: '#FF8356',
}

module.export = {
    education,
    wxreg,
    swiperConfig,
}
```

### 分包
小程序未超过2M大小，无需分包。超过2M，则采用分包，单包不超过2M，总计不超过16M。


### 分享
普通分享略过。   
带shareTicket的分享，且需要记录分享群的信息时：  
```javascript
/*
*path: src/app.wpy
*
*/
async onShow(ops) {
    const that = this;
    // 判断是否是群点击进入
    console.log('APP show : ', ops)
    that.scene = ops.scene;
    if (ops.scene === 1044 && ops.shareTicket !== undefined){
        that.shareTicket = ops.shareTicket;
    }
}
//页面
async onShow() {
    if(that.$parent.scene === 1044){
        await that.touchGroup();
    }
}
```

由分享进入小程序某个页面，需先判断缓存中是否存在 token ， 若不存在 token ， 则先请求登录接口，到后端换取 token ， 再请求其他api 。
```javascript
//某分享链接进入的页面
async onShow() {
    const that = this
    if( !wepy.getStorageSync('token')) {
        await that.getLogin()
    }
    that.getUserInfo()
}

//mixins - req
async getLogin(){
    await wepy.login().then(async (res) => {
        let result = await this.timeOut(circleApi.login({
            data: {
                app_id: this.$parent.globalData.appId,
                code: res.code
            }
        }));
        if(res.statusCode === 200){
            wepy.setStorage({
                key: "token",
                data: res.data.token
            })
            wepy.setStorage({
                key: 'user_id',
                data: res.data.user_id
            })
        }
    })
}
//超时处理
async timeOut(fn){
    let that = this;
    let res = await Promise.race([this.test(), fn]).then((data) => {
        return data
    });
    if(res === 'timeOut'){
        that.toast('请检查网络或者重新试一下', 'none' ,1500);
        let status = {
            statusCode: 300
        };
        return status
    }else {
        return res
    }
}
// 请求超时处理
test() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('timeOut')
        },20000)
    });
    return promise;
}
```

### formid 
小程序给用户发送模板消息需要消耗 fromID， 新版的则是授权。这里记录一下fromID的处理。  
发送一条模板消息需耗费一个 fromID  
fromID的存储应该是用户本次使用完小程序，然后把收集到的fromID一次性发送到后端  
```javascript
/*
*path: src/app.wpy
*
*/
onHide(){
    let form_ids = wepy.getStorageSync('form_ids');
    configApi.postFormId({
        data: {
            form_ids: form_ids
        },
        getToken: true
    });
    wepy.setStorageSync('form_ids', [])
}

// mixins - common
// 存储formid
    postFormId(id){
        let arr = wepy.getStorageSync('form_ids') || [];
        arr.push(id);
        wepy.setStorageSync('form_ids', arr)
    }

// 页面表单产生 fromID 
<form @submit="submit" report-submit="true">  
    <button class="publicBox" hover-class="none" form-type="submit">
        <image class="publicImg" src="../images/common/bigButton.png" ></image>
        <view class="publicText">发布</view>
    </button>
</form>
submit(e){ 
    this.postFormId( e.detail.formId )
},
```
当用户的表单提交行为产生了 fromID 时， 统一进行本地存储，在用户沙雕该小程序时再统一提交全部fromid

### 登录广播
登录广播可以解决很多同步问题，在app内，执行登录获取token，在token还未拿到时，首页的接口不能去执行，需要等待后端返回token后才可执行，这里有两种方式实现：  
method1： async/await   
app内会执行登录，首页也onload内判断token是否存在，不存在则重新登录（同步），在登录成功后在执行业务。
```javascript
// APP
onLaunch() {
    this.getLogin()    
}

//index.wpy
async onLoad() {
    if(!wepy.getStorageSync('token)) {
        await this.getLogin()
    }
    // 执行业务
}
```
以上方法在有大量分享进入小程序的场景下很实用，但是不存在token的用户（新用户）通常会请求两次登录。优化如下：利用广播，广播页面告知APP内登录是否成功，成功后各页面再去执行业务。  
```javascript
//app
import broadcast from './utils/broadcast'
onLaunch() {
    this.getLogin()
}
getLogin() {
    //登录请求
    broadcast.fire('login_success')
}

//业务页面 index.wpy
onLoad() {
    this.handleToken()
    boradcast.on('login_success', function(res) => {this.handleToken()}.bind(this))
}
handleToken() {
    if(!wepy.getStorageSync('token')) {
        return 
    }
    //执行业务
}
```
boradcast.js源码：  
```javascript
var broadcast = {
    // 通过调用 broadcast.on 注册事件。其他页面都可以通过调用 broadcast.fire 触发该事件
    // 参数说明：如果 isUniq 为 true，该注册事件将唯一存在；如果值为 false或者没有传值，每注册一个事件都将会被存储下来
    on: function (name, fn, isUniq) {
        this._on(name, fn, isUniq, false)
    },
    // 通过调用 broadcast.once 注册的事件，在触发一次之后就会被销毁
    once: function (name, fn, isUniq) {
        this._on(name, fn, isUniq, true)
    },
    _on: function (name, fn, isUniq, once) {
        var eventData
        eventData = broadcast.data
        var fnObj = {
            fn: fn,
            once: once
        }
        if (!isUniq && eventData.hasOwnProperty(name)) {
            eventData[name].push(fnObj)
        } else {
            eventData[name] = [fnObj]
        }
        return this
    },
    // 触发事件
    // 参数说明：name 表示事件名，data 表示传递给事件的参数
    fire: function (name, data, thisArg) {
        console.log('[broadcast fire]: ' + name, data, thisArg)
        var fn, fnList, i, len
        thisArg = thisArg || null
        fnList = broadcast.data[name] || []
        if (fnList.length) {
            for (i = 0, len = fnList.length; i < len; i++) {
                fn = fnList[i].fn
                fn.apply(thisArg, [data, name])
                if (fnList[i].once) {
                    fnList.splice(i, 1)
                    i--
                    len--
                }
            }
        }
        return this
    },
    data: {}
}
module.exports = broadcast
```