---
title: Charts
date: 2019-09-17 10:33:17
tags: Programming
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


##### G2封装实战
一个G2实例只能创建一个图表,若需要多个图表，可以封装G2 实例:
```javascript
/**
 * G2  
 * charths函数
 * warn:数据格式相同可复用一个函数,否则请重新另创图表函数
 */
// utils/charts.js
export function chartInstance( point, chartData, config={} ) {
  const [axisX, axisValue, axisY] = Object.keys(chartData[0])
  const chart = new G2.Chart({
    container: point,                         //point挂载点ID
    forceFit: config.width ? false : true,    //表宽自适应配置
    height: config.height || 600,
    width: config.width || null,              //若配置forceFit，则width不生效
  });
  chart.source(chartData, {
    axisX: {
      range: [0, 1],
      min: 0,
      max: 100
    }
  });
  chart.tooltip({
    crosshairs: {
      type: 'line'
    }
  });
  chart.axis(axisY, {
    label: {
      formatter: function formatter(val) {
        return val + '￥';
      }
    },
    title: {  
      textStyle: {
        fontSize: 12,               // 文本大小
        textAlign: 'center',        // 文本对齐方式
        fill: '#999',               // 文本颜色
      }
    },
    line: {
      lineDash: [3, 3]
    }
  });
  chart.line().position(`${axisX}*${axisY}`).color(`${axisValue}`).shape('smooth');         //平滑曲线图
  chart.point().position(`${axisX}*${axisY}`).color(`${axisValue}`).size(4).shape('circle').style({
    stroke: '#fff',
    lineWidth: 1
  });
  chart.render();
  return chart
}

//showData.vue
import { 
  chartInstance
} from '@/utils/charts'

data() {
  return{
    chartIncome:'',
    chartData2: [{}],
  }
},

mounted() {
  this.chartIncome = chartInstance('c1', this.chartData2)  //返回值很重要，关乎数据变动
  this.chartRegister = chartInstance('c2', this.chartData2) 
  this.chartActive = chartInstance('c3', this.chartData2) 
},

methods: {
  //切换数据
  onChangeIncome(e) {             
      const dateChange = e.target.value
      switch(dateChange) {
        case 'a': 
          this.chartIncome.changeData(this.chartData2)
          break
        case 'b':
          this.chartIncome.changeData(this.chartData3)
          break
        case 'c':
          this.chartIncome.changeData(this.chartData)
          break
      }
    },
}
```
![chart.png](https://i.loli.net/2019/09/20/VJMN1IEkumCAaoe.png)
