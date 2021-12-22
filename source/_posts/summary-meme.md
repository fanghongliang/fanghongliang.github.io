---
title: meme-总结
tags: 默认
categories: Programming
date: 2021-06-07 19:25:24
---

## 序言

简单记录一下在么么直播遇到的问题以及解决办法，项目技术栈跨度比较大，有 6-7 年前 jquery 项目，也有 React + MST（mobx state tree） + SSR 项目，还有纯 React 项目，遇到的问题比较广泛，记录一下常见的问题，帮助学习。

1. React 的更新机制

2. Ref 的一些用法

3. 受控组建和非受控组件

4. 命名空间

5. Canvas 实现弹幕组件  
   实现弹幕的核心是 Canvas 的 measureText()方法，该方法可以计算出画布上字体的宽度，由于弹幕的内容一般是由
   相对固定的图片加未知长度的文案构成，渲染复杂的单条弹幕首先需要解决弹幕总长度，拿到了总长度，那么不管是总体的弹幕背景还是图片文案的未知都能
   准确无误的渲染出来，React 可以把功能做成一个组件，一次完成，多次复用，这里我简单列举两种弹幕的实现，一种是普通的弹幕，构成是背景色 + 用户头像 + 相对固定的文案（比如抽奖弹幕，头像 + XXX 在 VVV 活动中 抽中了 AAAA x 99 次）， 一种是特殊弹幕，比如春节期间产品上线了祈福送礼需求，用户发送祝福语，然后立即在屏幕上弹幕形式出现，每条祝福语弹幕的背景样式不同，🈶️ 新春对联、燕子高飞、柳树纸条等，切每个用户输入的祝福语长度取决于用户自己，有时候一条弹幕就几个字，有的有几十字，知道每条弹幕的长度有两个用处，一是弹幕的背景位置渲染，而是弹幕采用四行并存的形式，那么弹幕插入哪一行也取决于哪一行的弹幕稀疏程度，话不多少，上图上代码：

   ```javascript
   // common 弹幕的引用文件

   export function getDevicePixelRatio(): number {
     // Fix fake window.devicePixelRatio on mobile Firefox
     const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

     if (window.devicePixelRatio !== undefined && !isFirefox) {
       return window.devicePixelRatio
     } else if (window.matchMedia) {
       const mediaQuery = (v: string, ov: string) => {
         return (
           '(-webkit-min-device-pixel-ratio: ' +
           v +
           '),' +
           '(min--moz-device-pixel-ratio: ' +
           v +
           '),' +
           '(-o-min-device-pixel-ratio: ' +
           ov +
           '),' +
           '(min-resolution: ' +
           v +
           'dppx)'
         )
       }
       if (window.matchMedia(mediaQuery('1.5', '3/2')).matches) {
         return 1.5
       }
       if (window.matchMedia(mediaQuery('2', '2/1')).matches) {
         return 2
       }
       if (window.matchMedia(mediaQuery('0.75', '3/4')).matches) {
         return 0.7
       }
     }
     return 1
   }

   // barrage-spring.tsx

   import { cancelAnimation } from '@utils/media'
   import { getDevicePixelRatio } from '@core/client'
   import { max } from '@utils/tool'
   ```


    const roundRect = function (ctx, left, top, width, height, r) {
    const pi = Math.PI;
    ctx.beginPath();
    ctx.arc(left + r, top + r, r, -pi, -pi / 2);
    ctx.arc(left + width - r, top + r, r, -pi / 2, 0);
    ctx.arc(left + width - r, top + height - r, r, 0, pi / 2);
    ctx.arc(left + r, top + height - r, r, pi / 2, pi);
    ctx.closePath();
    }

    const circleImg = function (ctx, img, l, t, r){
    const d = 2 * r
    ctx.save();
    ctx.beginPath()
    ctx.arc(l + r + 30, t + r - 3, r, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.clip();
    ctx.drawImage(img, l + 30, t - 3, d, d);
    ctx.restore();
    }

    const leftBg = function (ctx, leftImg, left, top, width, height) {
    ctx.save()
    ctx.drawImage(leftImg, left, top, width, height)   // height 94
    ctx.restore();
    }

    const middleBg = function (ctx, img, left, top, width, height) {
    ctx.save()
    ctx.drawImage(img, left+112, top, width, height)
    ctx.restore();
    }

    const rightBg = function (ctx, img, left, top, width, height) {
    ctx.save()
    ctx.drawImage(img, left, top, width, height)
    ctx.restore();
    }



    // const preImg = (url, callback, options) => {
    //   const {x, y, w, h} = options
    //   const img = new Image()
    //   img.src = testLeft || url
    //   if (img.complete) {
    //     callback.call(img, x, y, w, h)
    //     return
    //   }
    //   img.onload = () => {
    //     callback.call(img, x, y, w, h)
    //   }
    // }


    const getPxRatio = () => {
    const c = document.createElement("canvas"),
        ctx = c.getContext("2d"),
        dpr = getDevicePixelRatio() || 1,
        bsr = ctx['webkitBackingStorePixelRatio'] ||
        ctx['mozBackingStorePixelRatio'] ||
        ctx['msBackingStorePixelRatio'] ||
        ctx['oBackingStorePixelRatio'] ||
        ctx['backingStorePixelRatio'] || 1;

    return dpr / bsr;
    }

    export class Barrage {
    constructor(option) {
        const { canvasId, onPalyFinish } = option
        const pixelRatio = max([getPxRatio(), 2])
        this.pxRatio = pixelRatio;  // 缩放倍数，1会糊
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = this.w = this.canvas.width * pixelRatio;
        this.canvas.height = this.h = this.canvas.height * pixelRatio;
        this.drawing = true
        this.finishCount = 0
        this.ctx = this.canvas.getContext('2d');
        this.style = { // 弹幕样式
        height: 47 * pixelRatio,  // 弹幕高度   // 旧版高度29
        imgBgWidth: 56 * pixelRatio,  // 背景图片的宽度(左、右)
        fontSize: 12 * pixelRatio,  // 字体大小
        marginBottom: 20 * pixelRatio,  // 弹幕 margin-bottom
        paddingX: 15 * pixelRatio,  // 弹幕 padding x
        avatarWidth: 20 * pixelRatio,  // 头像宽度
        ellipsisMaxWidth: 100 * pixelRatio,
        offsetRight: 56 * pixelRatio   // 右背景偏移量
        }
        this.ctx.font = this.style.fontSize + 'px PingFangSC-Regular';
        this.onPalyFinish = onPalyFinish

        this.barrageList = [];  // 弹幕列表
        this.rowStatusList = [];  // 记录每行是否可插入，防止重叠。 行号为可插入 false为不可插入

        let rowLength = Math.floor(this.h / (this.style.height + this.style.marginBottom));
        for (var i = 0; i < rowLength; i++) {
        this.rowStatusList.push(i)
        }
    }

    shoot(value) {
        const { height, avatarWidth, fontSize, marginBottom, paddingX, ellipsisMaxWidth } = this.style;
        const { img, sortArr, t1, t2, t3, t4 } = value;
        const ellipsisT2 = this.getEllipsisText(t2)
        let row = this.getRow();
        let color = '#7C0102';
        let offset = this.pxRatio;
        let offsetNew = 30
        let w_0 = paddingX;  // 头像开始位置
        let w_1 = w_0 + avatarWidth + 8 + offsetNew + 10;  // t1文字开始位置
        let w_2 = w_1 + Math.ceil(this.ctx.measureText(t1).width) + 8;  // t2文字开始位置
        let w_3 = w_2 +  Math.ceil(this.ctx.measureText(ellipsisT2).width) + 8;  // t3文字开始位置
        let w_4 = w_3 + Math.ceil(this.ctx.measureText(t3).width) + 8;  // t4文字开始位置
        let w_5 = w_4 + Math.ceil(this.ctx.measureText(t4).width) + paddingX + 8;  // 弹幕总长度

        let barrage = {
        color,
        row,
        offset,
        top: row * (height + marginBottom),
        left: this.w,
        width: [w_0, w_1, w_2, w_3, w_4, w_5],
        value,
        ellipsisT2,
        }

        this.barrageList.push(barrage);
    }

    draw() {
        if (!this.drawing) {
        return
        }

        if (!!this.barrageList.length) {
        this.ctx.clearRect(0, 0, this.w, this.h);
        for (let i = 0, barrage; barrage = this.barrageList[i]; i++) {
            // 弹幕滚出屏幕，从数组中移除
            if (barrage.left + barrage.width[5] <= -25) {
            this.barrageList.splice(i, 1);
            this.finishCount ++;
            i--;
            continue;
            }

            // 弹幕完全滚入屏幕，当前行可插入
            if (!barrage.rowFlag) {
            if ((barrage.left + barrage.width[5]) < this.w - 45) {  //
                this.rowStatusList[barrage.row] = barrage.row;
                barrage.rowFlag = true;
            }
            }

            barrage.left -= barrage.offset;
            this.drawBarrage(barrage);
        }
        }
        this.reqAnimeId = requestAnimationFrame(this.draw.bind(this));
    }

    restartDraw() {
        this.drawing = true;
        this.draw()
    }

    clearDraw() {
        this.drawing = false
        cancelAnimation(this.reqAnimeId)
    }

    drawBarrage(barrage) {
        const { height, avatarWidth, fontSize, ellipsisMaxWidth } = this.style;
        const {
        value: { img, sortArr, t1, t3, t4,},
        ellipsisT2,
        color,
        row,
        left,
        top,
        offset,
        width,
        } = barrage;

        // 画框子
        // roundRect(this.ctx, left, top, width[5], height, height / 2, avatarWidth)
        // this.ctx.fillStyle = 'rgba(0,0,0,0.45)';
        // this.ctx.fill();

        // -- 画左边背景

        leftBg(this.ctx, sortArr[0], left , top, this.style.imgBgWidth, height)
        middleBg(this.ctx, sortArr[1], left , top, width[2]-width[1], height)
        rightBg(this.ctx, sortArr[2], left + width[5]- this.style.offsetRight , top, this.style.imgBgWidth, height )
        // left, top, width[1], height

        // 画头像
        // circleImg(this.ctx, img, left + width[0], top + (height - avatarWidth) / 2, avatarWidth/2)
        circleImg(this.ctx, sortArr[3], left + width[0], top + (height - avatarWidth) / 2, avatarWidth/2)

        // 新的top偏移量  15
        const offsetYNew = -4
        const paddingTop = (height - fontSize) / 2 - 2

        this.ctx.fillStyle = color;
        this.ctx.fillText(t1, left + width[1], top + fontSize + paddingTop + offsetYNew);

        this.ctx.fillStyle = '#CFFCFC';
        this.ctx.fillText(ellipsisT2, left + width[2], top + fontSize + paddingTop);

        this.ctx.fillStyle = color;
        this.ctx.fillText(t3, left + width[3], top + fontSize + paddingTop);

        this.ctx.fillStyle = '#FFFF33';
        this.ctx.fillText(t4, left + width[4], top + fontSize + paddingTop);
    }

    getRow() {
        let emptyRowList = this.rowStatusList.filter(d => /\d/.test(d));  // 找出可插入行
        let row = emptyRowList[Math.floor(Math.random() * emptyRowList.length)];  // 随机选一行
        this.rowStatusList[row] = false;
        return row;
    }

    haveEmptyRow() {
        let emptyRowList = this.rowStatusList.filter(d => /\d/.test(d));  // 找出可插入行
        return !!emptyRowList.length;
    }

    getEllipsisText(text) {
        const { ellipsisMaxWidth: maxWidth  } = this.style
        if (this.ctx.measureText(text).width <= maxWidth) {
            return text
        }

        const textArr = text.split('');//当前剩余的字符串
        for (let m = 1; m <= textArr.length; m++) {
        if (this.ctx.measureText(textArr.slice(0, m)).width > maxWidth) {
            return textArr.slice(0, m).join('') + '...'
        }
        }
    }
    }

    // danmu.tsx   弹幕组件，可以直接调用 <danmu />

    import React, { useEffect, useRef } from 'react'
    import styled from 'styled-components'

    import { defAvatarNew } from '@constants'
    import request from '@core/request'
    // import { Barrage } from '@utils/barrage'
    import { Barrage } from '@pages/act_spring_festival/barrage-spring'
    import { choice } from '@utils/tool'

    import { actions } from './config'

    export default (props: any) => {
    const storeRef = useRef<any>({
        timer: 0,
        finishCount: 0,
        barrage: null,
    })

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        const barrage = new Barrage({ canvasId: 'act-spring-barrage' })
        barrage.draw()
        storeRef.current.barrage = barrage

        return () => {
        barrage.clearDraw()
        clearTimeout(storeRef.current.timer)
        }
    }, [])

    const fetchData = () => {
        request(actions.wishList).then((resData) => {
        const items = resData || []
        if (items && items[0]) {
            shootBarrage(items[0])
            setTimeout(() => shootBarrage(items[1]), 500)
            startBarrage(2, items)
        }
        })
    }

    const startBarrage = (activeIndex: number, source: any[]) => {
        const { timer, barrage } = storeRef.current
        clearTimeout(timer)

        storeRef.current.timer = setTimeout(() => {
        let flag = false
        if (source[activeIndex]) {
            flag = shootBarrage(source[activeIndex])
        }
        if (barrage.finishCount && barrage.finishCount >= source.length - 3) {
            barrage.finishCount = 0
            fetchData()
        }
        startBarrage(!flag ? activeIndex : activeIndex + 1, source)
        }, choice([1000, 1800]))
    }

    const shootBarrage = (currentItem: any) => {
        const barrage = storeRef.current.barrage

        if (!barrage.haveEmptyRow() || !currentItem) {
        return false
        }

        const { pic = defAvatarNew, wish = '' } = currentItem

        const data = {
        t1: wish,
        t2: '',
        t3: '',
        t4: '',
        }

        // --一起初始化背景图
        const imgConf1 = [
        'https://img.sumeme.com/28/4/1612232722204.png',
        'https://img.sumeme.com/8/0/1612232705544.png',
        'https://img.sumeme.com/14/6/1612232681614.png',
        pic,
        ]

        const imgConf2 = [
        'https://img.sumeme.com/32/0/1612232775520.png',
        'https://img.sumeme.com/32/0/1612232762208.png',
        'https://img.sumeme.com/54/6/1612232743414.png',
        pic,
        ]

        const imgConf3 = [
        'https://img.sumeme.com/27/3/1612232818395.png',
        'https://img.sumeme.com/48/0/1612232804656.png',
        'https://img.sumeme.com/32/0/1612232789280.png',
        pic,
        ]

        // const imgConf4 = [
        //   'https://img.sumeme.com/25/1/1612232866777.png',
        //   'https://img.sumeme.com/32/0/1612232846432.png',
        //   'https://img.sumeme.com/33/1/1612232833441.png',
        //   pic,
        // ]

        const imgConfAll = [imgConf1, imgConf2, imgConf3]

        const imgArray = choice(imgConfAll)

        const receiveArray: any[] = []
        // let $myContent = document.getElementById("myContent");
        // let [imgW, imgH] = [300, 300];

        // let Canvas = document.createElement('canvas');
        // let ctx = Canvas.getContext("2d");
        // let scaleBy = 2;
        // Canvas.width = imgW * scaleBy;
        // Canvas.height = imgH * scaleBy;
        imgArray.forEach((e: any, idx: number) => {
        const img = new Image()
        img.src = e
        img.setAttribute('crossOrigin', 'Anonymous')
        img.addEventListener('load', () => {
            // ctx.drawImage(img, 0, 0, imgW * scaleBy, imgH * scaleBy);
            img.id = 'img' + idx
            receiveArray.push(img) // 将绘制的img节点收集到数组里，这里的顺序可能和imgArray的顺序不一样
            if (receiveArray.length === imgArray.length) {
            // 所有图片load并绘制完成
            const sortArr = new Array()
            receiveArray.forEach((ex) => {
                // 将所有绘制图片按imgArray顺序排序
                sortArr[ex.id.split('img')[1]] = ex
            })
            barrage.shoot({
                sortArr,
                ...data,
            })
            // sortArr.forEach(ex2 => {
            //     $myContent.appendChild(ex2)
            // })
            }
        })
        })

        // const img = new Image()
        // img.setAttribute('crossOrigin', 'anonymous')
        // const data = {
        //   t1: wish,
        //   t2: '',
        //   t3: '',
        //   t4: '',
        // }
        // img.onload = () => {
        //   barrage.shoot({
        //     img,
        //     ...data,
        //   })
        // }
        // img.onerror = () => {
        //   barrage.finishCount++
        // }
        // let pic1 = 'https://img.sumeme.com/27/3/1611904142299.png'
        // console.log('---', pic)
        // img.src = pic1
        return true
    }

    return (
        <StyledBarrage>
        <canvas id="act-spring-barrage" height="250px" />
        </StyledBarrage>
    )
    }

    export const StyledBarrage = styled.div`
    position: absolute;
    bottom: -120px;
    width: 750px;
    height: 550px;
    /* z-index: 99999; */
    canvas {
        width: 100%;
        height: 100%;
    }
    `

    ```
    抽空把这个弹幕写个 demo ，光干巴巴的文字是在难以理解啊

6. Node 的版本控制

   这个一般使用 nvm 或者 n 命令

7. 移动端和 H5 的桥接通信

   使用 jsBridge 进行 H5 和移动端的通信。具体后面整理一下。

8. 直播礼物的动画播放队列实现

9. Video 播放 mp4 的注意点

   react 中播放 mp4 格式，会有一些 iOS 机型的兼容问题，不如 iOS 不能自动播放等

```javascript
//React中播放mp4的情况，一帮情况下播放GIF或者SVGA
// 代码如下
<div
  className="video-box"
  dangerouslySetInnerHTML={{
    __html: `
        <video
        id="entry-video"
        poster="https://img.sumeme.com/16/0/1624613307152.png"
        autoPlay
        x-webkit-airplay="allow"
        x5-video-player-type="h5"
        webkit-playsinline
        playsinline
        muted
        style="object-fit:fill"
        >
        <source src="https://img.sumeme.com/swf/Render6-16.mp4" type="video/mp4"> 
        </video>
        `,
  }}
/>
```

    poster属性可以在视频未加载完成前展示一张封面图片，视频加载后自动播放视频。

10. hooks 封装

    其实相比自己封装有针对性的 hooks 外，阿里的 ahooks3.0 也可以使用，功能还是值得期待的

11. React 中挂载滑动函数

12. 抽奖

13. 一些 CSS

    ```
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    // 解决iOS和iPad设备上点击状态出现默认蓝色高亮，很常见
    ```

## CSS 点九图

最近年中和周年庆开始，铺天盖地的活动。UI 设计的风格和一往不太一样，举一个栗子： 在投票页面中，每个被投票的主播都是单独的一张特殊背景图包裹，该容器可能会根据被投票人的信息长短不一，不规则背景边框图也要自动适应。类似这样的需求，一般有这么几种方法实现：

1. 三段图重复
   就是把不规则的背景图切成三段。头部、中间部分、底部，中间部分利用背景图的 repeat 来自适应，缺点就是不灵活，需要找 UI 切图，里面内容的间距控制不精准

2. 点九图
   点九图是移动端的一种做法，就是一张图切四刀，四个角不伸缩，保持原图比例。四条边进行伸缩，中间的部分用来填充，一共九个部分，所以称点九图。CSS3 也可以实现点九图，且效果不错，举个例子：  
   写一个业务组件，只用来做 wrap 包裹，用点九图，这样其他的同样式的组件都可以复用。

```javascript
import React from 'react'
import styled from 'styled-components'

import { StyledBaseWrap } from '../styled'

type Props = {
  children: any
  title?: string
  // title?: string
  // headerType?: 'icon' | 'pureString'
}

export default (props: Props) => {
  const { children, title = '' } = props

  if (!children) {
    return null
  }

  return (
    <StyledBaseWrap>
      <i className="bg" />
      {
        title && (
          <div className="title-bg-box">
            <i className="title-bg" />
            {/* <p className="you-she">{title}</p> */}
            <div className="you-she">{title}</div>
          </div>
        )
      }
      {children}
    </StyledBaseWrap>
  )
}

const StyledBaseWrap = styled.div`
  position: relative;
  width: 680px;
  margin: 0 auto;
  min-height: 320px;
  & > * {
    margin: 0 auto;
  }
  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    border-style: solid;
    border-width: 130px 340px 190px 340px;
    border-image-source: url(${require('./images/bg_wrap.png')});
    border-image-slice: 130 340 190 340 fill;
    border-image-width: 1;
    border-image-repeat: repeat;
  }
  .title-bg-box {
    position: absolute;
    min-width: 380px;
    top: -20px;
    margin: 0 auto;
    font-size: 32px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 100px;
    box-sizing: border-box;
    div {
      position: relative;
      height: 52px;
      line-height: 52px;
      white-space: nowrap;
    }
  }
  .title-bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
    border-style: solid;
    border-width: 24px 172px 24px 172px;
    border-image-source: url(${require('./images/title_bg.png')});
    border-image-slice: 24 172 24 172 fill;
    border-image-width: 1;
    border-image-repeat: repeat;
    margin: 0 auto;
  }
`
```

使用 'border-image-slice' 属性来完成点九图，它接受 4 个参数，分别在图片的上右下左切一刀，把图片分为 9 个部分，一中心，四个角，四个边。伸缩只会让边进行伸缩，所以需要调整切的位置，尽量在规则的地方下刀。此时，若父容器的宽高未给定，则完全由内容撑开宽高，
上面栗子中，宽度做了限制，高度未限制，传入的 children 会撑开点九图组件的高度，做到每个子组件高度根据内容自适应，但整体的样式不会发生变化。
