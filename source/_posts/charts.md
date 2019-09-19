---
title: Charts
date: 2019-09-17 10:33:17
tags:
categories: Antv-G2

---


#### 序言
antv蚂蚁官网： <https://antv.alipay.com/zh-cn/index.html>

#### G2

##### G2引入

1. CDN：   
`<script src="https://gw.alipayobjects.com/os/lib/antv/g2/3.4.10/dist/g2.min.js"></script>
`

2. NPM:  
`$ npm install @antv/g2 --save`  
`import G2 from '@antv/g2'`  

3. 本地脚本：  
`<script src="./g2.js"></script>`

##### 实现方式
Vue中有标签式、导入式。  
1. 标签式
```html
<div>
  <v-chart :forceFit="true" :height="height" :data="data777" :scale="scale">
    <v-tooltip />
    <v-axis />
    <v-line position="year*value" />
    <v-point position="year*value" shape="circle" />
  </v-chart>
</div>
```
```javascript
const data777 = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const scale = [{
  dataKey: 'value',
  min: 0,
},{
  dataKey: 'year',
  min: 0,
  max: 1,
}]
```

2. 导入式  
导入式图表由G2代码生成，挂载在容器上即可，G2代码一定写在 *mounted* 钩子内！

```html 
<!-- vue标签 -->
<div id="c1"></div>
```

```javascript
const chartData = [{
    "month": "Jan",
    "city": "Tokyo",
    "temperature": 7
}, {
    "month": "Jan",
    "city": "London",
    "temperature": 3.9
}, {
    "month": "Feb",
    "city": "Tokyo",
    "temperature": 6.9
}];

// ......
mounted() {
  var chart = new G2.Chart({
  container: 'c1',
  forceFit: true,
  height: 600
});
chart.source(chartData, {
  month: {        
    range: [0, 1]          //配置横轴的宽度范围
  }
});
chart.tooltip({
  crosshairs: {
    type: 'line'
  }
});
chart.axis('temperature', {
  label: {
    formatter: function formatter(val) {
      return val + '°C';
    }
  }
});
chart.line().position('month*temperature').color('city');      //position('X轴*Y轴')
chart.point().position('month*temperature').color('city').size(4).shape('circle').style({
  stroke: '#fff',
  lineWidth: 1
});
chart.render();
},
```