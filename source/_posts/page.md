---
title: 直播相关Live【hybrid】
tags: 么么直播
categories: 么么直播
date: 2022-01-01 16:46:39
---

### 序言

直播间一些复杂功能的实现和总结，包括但不限于 IM 及时通讯消息、融云、融信 IM 私聊消息、推拉流、WebSocket 推送、Hybrid 与 H5 的桥接通信、mobx-state-tree | React 重构 远古 JQ 代码、 PC 直播间深度链接至移动端、用户极验证（验证非脚本或机器人）、进场特效、用户头像挂坠、炫彩昵称、用户财富、等级、身份标签组件化、拖拽等组件应用、

### 动画

#### SVGA

Svga 是常见的一种直播间动画播放格式，其特性这里不做过多解释，今天总结一下在 H5 端 和 PC 端 播放 Svga 动画的全过程。封装公用方法以及优化、避坑。

动画播放在用户送礼、礼物预览等场景下使用频繁，封装一个公用方法在项目 lib 十分必要。这里使用 【svgaplayerweb】

封装方法：

```javascript
export function retryPromise(promiseFn, retriesLeft = 5, interval = 1500) {
  return new Promise((resolve, reject) => {
    promiseFn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }
          retryPromise(promiseFn, retriesLeft - 1, interval).then(
            resolve,
            reject
          );
        }, interval);
      });
  });
}

/**
 * 加载svga动画
 * @param {String} id dom-id
 * @param {src} src svga文件路径
 * @param {Number} loops 循环次数,默认为0无限循环
 * @param {Function} onFinished 完成回调
 * @param {Boolean} isPlayNow 是否立即播放，默认true
 */
const svgaModules = {};
export function svgaPlayer(option) {
  const {
    id,
    src,
    loops = 0,
    onFinished,
    clearsAfterStop = true,
    fillMode = "Backward",
    isPlayNow = true,
  } = option;
  if (!id) {
    return;
  }

  const play = () => {
    const { svga } = svgaModules;
    const player = new svga.Player(`#${id}`);
    const parser = new svga.Parser(`#${id}`);

    parser.load(src, (videoItem) => {
      player.loops = loops;
      player.clearsAfterStop = clearsAfterStop;
      player.fillMode = fillMode;
      player.setVideoItem(videoItem);
      player.onFinished(() => {
        if (onFinished) {
          onFinished();
        }
      });

      isPlayNow && player.startAnimation();
    });
  };

  if (svgaModules.svga) {
    play();
    return;
  }

  retryPromise(() => import("svgaplayerweb")).then((svga) => {
    svgaModules.svga = svga;
    play();
  });
}
```

以上封装可以满足常见的动画播放场景。

#### Tab 点击动画场景

现在的 H5 交互越来越体现用户至上，在 tab 的点击上，设计师更想要用户点击 某个 tab 播放该 tab 的动画状态，常见的有点击 hybrid 页面根 tab，该 tab 会抖动动画或者无衔接播放一个小动画，这个设计师给的 svga 动画，实现只需要上述公用方法 【isPlayNow】 参数，默认只让动画加载而不立即播放，展示第一帧，效果和静态 tab 一样，待点击时在 修改 【isPlayNow】 为 true，播放动画即可实现上述效果。

#### VAP

vap [video-animation-player] 是腾讯企鹅电竞推出的开源 mp4 播放库，具体移步 GitHub 仓库，该库适配三端，这里只总结下 Web 端

封装公用方法：

```javascript
// vap-player.js

import Vap from "video-animation-player";
import { request } from "lib";

let vap = null;

const play = (opt) => {
  let {
    container,
    src,
    configUrl,
    imgUser,
    textUser,
    width = "100%",
    height = "100%",
    fontStyle,
    loop = false,
    fps = 24,
    mute = true,
    precache = false,
    accurate = false,
    onStop = () => {},
  } = opt;
  const fn = (config) => {
    if (vap) {
      vap.destroy();
    }
    vap = new Vap(
      Object.assign(
        {},
        {
          container,
          src,
          config,
          width,
          height,
          fontStyle,
          imgUser,
          textUser,
          loop,
          fps: config.info.fps || fps,
          precache,
          mute,
          accurate,
        }
      )
    )
      .on("error", (e) => {
        vap.destroy();
        onStop();
      })
      .on("ended", () => {
        vap.destroy();
        onStop();
      });
  };

  request.api.get(configUrl).then((res) => {
    fn(res.data);
  });
};

const destroy = () => {
  if (vap) {
    vap.destroy();
  }
};

export default { play, destroy };

// 引用

import VapPlayer from "lib";
VapPlayer.play(options);
```

使用 vap 在部分机型导致动画效果模糊锯齿的解决办法： Dom 容器的宽高扩大 400%，再缩小 ‘transform: scale(0.25);’ 缩小四倍。


### Chrome不支持obs虚拟摄像头解决方法  
直播平台一般都会有自己对应的开播工具，比如YY、虎牙助手、OBS等。采用OBS采集视频流，会使用虚拟摄像头，Chrome有时候会不支持虚拟摄像头，解决办法为： 浏览器默认未允许虚拟摄像头的使用，在出Chrome的设置中打开对应的隐私配置即可，具体步骤可以Google。
### IM 及时通讯消息

待整理

### 推拉流

### dsBridge 桥接通信

### socket 监听发布

### CSS炫彩昵称  

五颜六色的炫彩昵称CSS实现  




```html
<!-- html -->
<WrapColorName>
  <div className="name">用户昵称哇哈哈</div>
</WrapColorName>
```

```css

/* 这里使用 styled-components 写法，可以改成其他CSS框架写法，语法不变 */

const maskedAnimation = keyframes`
  from {
    background-position: 0 0;
  }
  to {
    background-position: -200% 0;
  }
`;

const WrapColorName = styled.div`
  background-image: -webkit-linear-gradient(
    left,
    #f70000,
    #ff891c 14.3%,
    #ffe719 28.6%,
    #33e97c 43%,
    #1dd5ff 57%,
    #ec80ff 71.4%,
    #ff43dc 86%,
    #ff43cb 100%
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: ${maskedAnimation} 3s infinite linear;
`
```

上面的demo 可以直接在本地跑，主要利用 webkit-background-size 的位置偏移和 webkit-animation 背景光束实现炫彩动画文案，上述案例可以直接在 [演示地址](https://test.2339.com/v2/example "点击这里") 查看

