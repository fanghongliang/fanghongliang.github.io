---
title: Amis
tags: 默认
categories: 默认
date: 2021-02-24 20:11:31
---

#### Aims系列的高级用法  
Amis是百度开源的一套企业级管理系统，一个低代码前端框架，它使用 JSON 配置来生成页面，可以减少页面开发工作量，极大提升效率。 

#### Ovine
一个支持使用 Json 构建完整管理系统 UI 的框架，基于 Amis 二次开发。

#### 相关文档依赖

> [React](https://react.docschina.org/docs/getting-started.html)
> [Amis](https://baidu.gitee.io/amis/zh-CN/docs/index)
> [styled-component](https://github.com/artf/grapesjs)
> [immer](https://github.com/pelotom/use-methods)
> [font-awesome](https://github.com/pelotom/use-methods)

#### icon使用  
    在Ovien项目中，icon的使用很简单也非常丰富，在[font-awesome](https://fontawesome.dashgame.com/)中选取适合你的icon名称即可
    ```
    icon: 'fa fa-${icon_name}'
    ```
#### onFakeRequest应用

amis对后端或者说中台转换依赖比较强，返回的API数据一般是后端组装好的JSON数据，直接渲染，但是对于其他后端不是很强大的项目来说，onFakeRequest应用就很有必要，它实现了假请求，在假请求里根据返回的数据拼接我们需要的schema，最后返回出去进行渲染，如下动态渲染


#### 动态渲染
动态渲染目前只能在 Service 容器中实现，核心思路是由后台返回需要的数据，再加以拼接返回一个Schema进行渲染而成。
常见需求为： 某一个管理页面的行的每一项不是固定的，是根据其他配置页数据来渲染的，例如直播道具的使用情况，道具并不是事先就约定好的，是可配置的，想要渲染道具的使用数据表就得动态渲染表头。表头的数据接口只返回了简单的标识，未返回schema节点，我们在 onFakeRequest 里拼接schema返回渲染，具体看代码：

```javascript 
schemaApi: {
$preset: 'apis.tabConf',
url: 'fakeRequest',
onFakeRequest: async (source) => {       // 假请求（Ovien实现）
    const confData = await app.request({
    url: 'GET api/v1/apps/meme/hot-card',
    domain: 'flint',
    })
    const cardConf = confData.data.data['hot-card']['hot-cards'] || {}
    const colConf = [
    {
        name: 'nickname',
        label: '用户昵称(ID)',
        type: 'tpl',
        tpl: '${nickname}(ID:${_id})'
    }
    ]
    const selectConf = []

    Object.keys(cardConf).map((key) => {
    const item = cardConf[key]
    const colOpt = {
        label: `${item['gift-name']}(未使用)` || '-',
        name: key,
        type: 'tpl',
        // tpl: `<%= (data.remain[${key}] || '-') + '/' + (data.total[${key}] || '-') %>`,
        tpl: `<%= (data.remain[${key}] || '/') %>`,
    }
    const selectOpt = {
        label: `${item['gift-name']} (${item['hot-value']}热度/张，生效${item.duration}分钟)`,
        value: key
    }
    selectConf.push(selectOpt)
    colConf.push(colOpt)
    return true
    })
    
    // 二次弹窗内容
    const retrieveCard = {
    api: {
        url: 'GET hotcard/del.json',
        data: {
        user_id: '$_id',
        gift_id: '$giftSelect',
        num: '$delNum',
        }
    },
    type: 'form',
    horizontal: {
        left: 'col-sm-3',
        right: 'col-sm-8',
    },
    controls: [
        {
        type: 'select',
        label: '热度卡类型',
        name: 'giftSelect',
        required: true,
        options: selectConf,
        },
        {
        type: 'number',
        name: 'delNum',
        label: '回收数量',
        description: '请输入每人回收热度卡的数量',
        required: true,
        // min: 1,
        precision: 0,
        },
    ]
    }

    const retrieve: any = {
    type: 'action',
    label: '回收热度卡',
    level: 'danger',
    // visibleOn: '!data.status',
    actionType: 'dialog',
    dialog: {
        title: '回收热度卡',
        body: retrieveCard,
    },
    }

    colConf.push(retrieve)
    const schemaNode = {
    type: 'lib-crud',
    syncLocation: false,
    // api: '$preset.apis.remainList',
    primaryField: '_id',
    perPageField: 'size',
    pageField: 'page',
    perPageAvailable: [50, 100, 200],
    defaultParams: {
        size: 50,
    },
    api: {
        url: 'GET hotcard/remain.json'
    },
    // source: '$rows',
    headerToolbar: [
        {
        type: 'columns-toggler',
        align: 'left',
        },
        // {
        //   $preset: 'actions.add',
        //   align: 'right',
        // },
    ],
    footerToolbar: ['statistics', 'switch-per-page', 'pagination'],
    columns: colConf,
    filter: {
        type: 'form',
        title: '搜索',
        controls: [
        {
            type: 'text',
            name: 'user_id',
            value: '',
            placeholder: '输入用户ID搜索',
        },
        {
            type: 'submit',
            className: 'm-l',
            label: '搜索',
        },
        ]
    },
    }
    source.data = schemaNode
    return source
}
},

```
