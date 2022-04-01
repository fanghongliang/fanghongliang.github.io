---
title: 直播相关Live【hybrid】
tags: 默认
categories: 默认
date: 2022-01-01 16:46:39
---


### 序言  

直播间一些功能的实现和总结


### 动画播放  

#### SVGA  

Svga是常见的一种直播间动画播放格式，其特性这里不做过多解释，今天总结一下在 H5端 和 PC端 播放Svga动画的全过程。封装公用方法以及优化、避坑。  

动画播放在用户送礼、礼物预览等场景下使用频繁，封装一个公用方法在项目 lib 十分必要。这里使用 【svgaplayerweb】  

封装方法：  

```javascript
export function retryPromise(promiseFn, retriesLeft = 5, interval = 1500) {
  return new Promise((resolve, reject) => {
    promiseFn()
      .then(resolve)
      .catch(error => {
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

    parser.load(src, videoItem => {
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

  retryPromise(() => import("svgaplayerweb")).then(svga => {
    svgaModules.svga = svga;
    play();
  });
}

```  

以上封装可以满足常见的动画播放场景。  

### tab点击动画场景  

现在的H5交互越来越体现用户至上，在 tab 的点击上，设计师更想要用户点击 某个tab播放该tab的动画状态，常见的有点击hybrid页面根tab，该tab会抖动动画或者无衔接播放一个小动画，这个设计师给的 svga 动画，实现只需要上述公用方法 【isPlayNow】 参数，默认只让动画加载而不立即播放，展示第一帧，效果和静态tab一样，待点击时在 修改 【isPlayNow】 为 true，播放动画即可实现上述效果。


#### VAP  

vap [video-animation-player] 是腾讯企鹅电竞推出的开源mp4播放库，具体移步GitHub仓库，该库适配三端，这里只总结下 Web 端  

封装公用方法：

```javascript
  // vap-player.js

import Vap from 'video-animation-player'
import { request } from 'lib'

let vap = null

const play = (opt) => {
  let {
    container,
    src,
    configUrl,
    imgUser,
    textUser,
    width = '100%',
    height = '100%',
    fontStyle,
    loop = false,
    fps = 24,
    mute = true,
    precache = false,
    accurate = false,
    onStop = () => {
    }
  } = opt;
  const fn = (config) => {
    if (vap) {
      vap.destroy()
    }
    vap = new Vap(Object.assign({}, {
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
      accurate
    }))
      .on('error', (e) => {
        vap.destroy()
        onStop()
      })
      .on('ended', () => {
        vap.destroy()
        onStop()
      })
  }

  request.api.get(configUrl).then(res => {
    fn(res.data)
  })
}

const destroy = () => {
  if (vap) {
    vap.destroy()
  }
}

export default { play, destroy };

// 引用

import VapPlayer from 'lib'
VapPlayer.play(options)


```   
使用vap 在部分机型导致动画效果模糊的解决办法： Dom容器的宽高扩大400%，再缩小 ‘transform: scale(0.25);’ 缩小四倍。

