---
title: electron
tags: electron
categories: Javascript
date: 2023-02-13 14:13:23
---

```javascript

```

### Electron
本篇文章将结合官方文档以及实际线上每天万人使用的一款开播工具源码片段综合阐述下Electron 的开发经验和技巧  

Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 Chromium 和 Node.js 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在Windows上运行的跨平台应用 macOS和Linux——不需要本地开发经验。 


### 开发环境  

1. 您需要安装 node.js 建议安装最新的LTS版本
2. 因为 Electron 将 Node.js 嵌入到其二进制文件中，你应用运行时的 Node.js 版本与你系统中运行的 Node.js 版本无关。
3. Electron 应用程序遵循与其他 Node.js 项目相同的结构。 首先创建一个文件夹并初始化 npm 包。
```javascript
  mkdir my-electron-app && cd my-electron-app
  npm init
```
4. init初始化命令会提示您在项目初始化配置中设置一些值 为本教程的目的，有几条规则需要遵循：
 . entry point 应为 main.js.
 . author 与 description 可为任意值，但对于应用打包是必填项。
这里官网只是作为一个demo来规划文件结果，实际开发环境中，Electron应用很可能是在原有业务的网页版项目中 ，比如一个网页版直播页面，使用React + next 实现。现在要实现开播工具桌面端饮用，一般直接选择在
原有的项目文件中直接新建文件夹开始，那么入口文件很可能不是根目录下 main.js，这点我们通过 package.json 的配置 main: 'xxx'可以解决. 至于说 Electron 是 “Web网页” 套了桌面端的壳，那为什么我们还要使用 Electron呢？ 因为Web应用无法拿到操作系统的权限，这对于我们解决一些问题十分关键。 

```json
// package.json
{
  "description": "www.2339.com",
  "main": "app/main.js",  // 这里配置了项目的入口文件
}
```

5. 按装 Electron包 并创建执行脚本

```json 
yarn add --dev electron

// 配置 package.json 4种环境，一般学习只需要配置一种即可，打包命令后续也在这里配置
{
  "scripts": {
    "electron:dev": "electron .",
    "electron:staging": "cross-env NODE_ENV=development ELECTRON=1 MODE=staging nextron -p 9401 .",
    "electron:grey": "electron .",
    "electron:production": "electron .",
  }
}

// 命令启动 dev 环境
yarn electron:dev 

```

6. 运行主进程
任何 Electron 应用程序的入口都是 main 文件。 这个文件控制了主进程，它运行在一个完整的Node.js环境中，负责控制您应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程(稍后详细介绍)。  
执行期间，Electron 将依据应用中 package.json配置下main字段中配置的值查找此文件，您应该已在应用脚手架步骤中配置。


7. 创建页面  
在可以为我们的应用创建窗口前，我们需要先创建加载进该窗口的内容。 在Electron中，各个窗口显示的内容可以是本地HTML文件，也可以是一个远程url。

8. 在窗口中打开您的页面  
现在您有了一个页面，将它加载进应用窗口中。 要做到这一点，你需要 两个Electron模块：

. app 模块，它控制应用程序的事件生命周期。
. BrowserWindow 模块，它创建和管理应用程序 窗口。
因为主进程运行着 Node.js，您可以在 main.js 文件头部将它们导入作为 CommonJS 模块：



### 专有名词 

- 窗口

- 预加载脚本

- 渲染器

- 主进程
每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力
主进程的主要目的是使用 BrowserWindow 模块创建和管理应用程序窗口。
BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页。 您可从主进程用 window 的 webContent 对象与网页内容进行交互。

- 应用程序生命周期
主进程还能通过 Electron 的 app 模块来控制您应用程序的生命周期。 该模块提供了一整套的事件和方法，可以让您用来添加自定义的应用程序行为 (例如：以编程方式退出您的应用程序、修改应用程序坞，或显示一个关于面板) 

- app 模块





- BrowserWindow 模块
BrowserWindow 类的每个实例创建一个应用程序窗口，且在单独的渲染器进程中加载一个网页。 您可从主进程用 window 的 webContent 对象与网页内容进行交互。
由于 BrowserWindow 模块是一个 EventEmitter， 所以您也可以为各种用户事件 ( 例如，最小化 或 最大化您的窗口 ) 添加处理程序。
当一个 BrowserWindow 实例被销毁时，与其相应的渲染器进程也会被终止。

- CommonJS 模块

- Preload 脚本
预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码 。 这些脚本虽运行于渲染器的环境中，却因能访问 Node.js API 而拥有了更多的权限。
预加载脚本可以在 BrowserWindow 构造方法中的 webPreferences 选项里被附加到主进程。
因为预加载脚本与浏览器共享同一个全局 Window 接口，并且可以访问 Node.js API，所以它通过在全局 window 中暴露任意 API 来增强渲染器，以便你的网页内容使用。
-----------
下面是渲染进程中选取用户操作系统文件中的一张图片
即打开系统文件夹，选取一张图片
```javascript
// 在 preload 脚本中增加全局消息处理机制 
// preload.js
window.electron = {
  message: {
    send: (payload) => {
      return ipcRenderer.send('message', payload);
    },
    on: (handler) => {
      return ipcRenderer.on('message', handler);
    },
    off: (handler) => {
      return ipcRenderer.off('message', handler);
    },
  },
};

// lib/qtClient 资源文件夹
// 封装一个全局公用方法

const clientEvent = new EventEmitter();

const inti = (cb) => {
  // PC项目和electron项目在同一工程中
  if (!browser.electronClient) {
    console.info(
      '======================\r\n非 electron 环境\r\n======================',
    );
    return;
  }

  // 监听主进程事件
  window.electron.message.on((event, msg) => {
    if (msg.id) {
      clientEvent.emit(msg.id, msg);
    } else {
      clientEvent.emit(msg.action, msg);
    }
    clientEvent.emit('all', msg);
  });

  cb && cb();
}

// call 消息封装
const call = ({
  action,
  data = {},
  onSuccess = (msg) => {},
  onFail = (msg) => {},
}) => {
  // 同上，区分electron环境
  if (!browser.electronClient) {
    return;
  }
  if (!action) {
    console.error('action is required');
    return;
  }
  const options = {
    id: utils.getRandomString(),
    action,
    data,
  };

  clientEvent.once(options.id, (msg) => {
    if (msg.code === 1) {
      onSuccess(msg);
    } else {
      onFail(msg);
    }
  });

  if (typeof data === 'function') {
    options.data = {};
  }

  if (action !== 'getSystemInfo') {
    log(`call【${action}】 options:`, options);
  }

  window.electron.message.send(options);
};

const qtClient = {
  init, 
  call
}

export default call

// 封装具体的业务需求-选取图片
// app-client.js

const selectImage = (onSuccess) => {
  qtClient.call({
    action: 'selectImage',
    onSuccess,
  });
};


// 具体业务环境中使用
// eg 主播开播合流时往视频区域添加一张图片

const handleAddImage = () => {
  appClient.selectImage((msg) => {
    const { filePath, fileName, ext, width, height } = msg.data;
    // 返回有文件的具体信息，文件名、路径等
    // 处理你的业务
    // 比如： 把文件信息在通过则 zego 等三方传递出去，最终在直播流中成功添加一张图片或Gif
  })
}



// -----------------分割线--------------
// 以上代码是渲染进程处理的事
// 渲染进程向主进程发送了想要打开用户文件夹获取图片的消息， ipcRenderer
// 以下将是主进程中监听渲染进程的消息，并作出处理  ipcMain


// main.ts

import message from './message';

message.init()


// message.ts
// 处理所有的主进程消息



  // 打开文件夹，并选取图片文件
  const selectImage = (event, message) => {
  dialog
    .showOpenDialog({
      title: '选择图片',
      properties: ['openFile'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif', 'bmp'] },
      ],
    })
    .then(async ({ canceled, filePaths, bookmarks }) => {
      if (filePaths.length) {
        const filePath = filePaths[0];
        const { width, height } = imageSize(filePath);
        // const {fileTypeFromFile} = await import('file-type')
        // const fileType = await fileTypeFromFile(filePath);

        const [fileName, fileExt] = filePath
          .replace(/\\/gi, '/')
          .split('/')
          .pop()
          .split('.');

        // const ext = fileType?.ext || fileExt;
        const ext = fileExt;

        responseSuccess(event, message, {
          data: {
            filePath: filePaths[0],
            fileName,
            width,
            height,
            ext: ext.toLowerCase(),
          },
        });
      }
    });
};


const actions = {
  selectImage,
}

const init = () => {
  ipcMain.on('message', (event, message) => {
    // event.sender.send('message', message);
    if (message.action !== 'getSystemInfo') {
      log.info('[ipcMain message]', message);
    }

    if (actions[message.action]) {
      actions[message.action](event, message);
    } else {
      log.warn('action not found', message.action);
    }
  });
};

```

至此，一个完善的渲染进程-主进程通信框架就搭建完毕，后续其他的通信需求直接扩展上即可。

虽然预加载脚本与其所附着的渲染器在共享着一个全局 window 对象，但您并不能从中直接附加任何变动到 window 之上，因为 contextIsolation 是默认的。
语境隔离（Context Isolation）意味着预加载脚本与渲染器的主要运行环境是隔离开来的，以避免泄漏任何具特权的 API 到您的网页内容代码中。

取而代之，我们將使用 contextBridge 模块来安全地实现交互

- darwin
Darwin 是MacOSX 操作环境, 即苹果电脑的操作系统

- 打包工具
electron-builder

- CLI
 命令行接口  


- devDependencies
开发环境需要的额外依赖，您的应用需要运行 Electron API，因此这听上去可能有点反直觉。 实际上，打包后的应用本身会包含 Electron 的二进制文件，因此不需要将 Electron 作为生产环境依赖。

- 原生 API
为了使 Electron 的功能不仅仅限于对网页内容的封装，主进程也添加了自定义的 API 来与用户的作业系统进行交互。 Electron 有着多种控制原生桌面功能的模块，例如菜单、对话框以及托盘图标。







