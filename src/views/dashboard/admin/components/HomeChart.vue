<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize' // 有bug 停止使用
import { getDate, getDayList } from '@/utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ chartData } = {}) {
      // 注意chartData不能修改 否则会导致vue的loop错误
      console.log('linchart.setOptions')
      console.log(chartData)
      // chartData = [['2020-01-01', 37], ['2020-01-02', 3], ['2020-01-03', 36]]
      console.log(chartData)
      // 时间显示范围
      var startDay = getDate(-14)
      var endDay = getDate(0)
      var anchor = [[startDay, 0], [endDay, 0]]

      // 给data填充0，形成新的list 解决数据量少时坐标轴移位问题
      var formatData = JSON.parse(JSON.stringify(chartData)) // 用于画图的数据集
      var dayList = getDayList(startDay, endDay) // 日期列表
      var dataDay = chartData.map(function(x) {
        return x[0]
      }) // 有数据的日期
      for (var i = 0; i < dayList.length; i++) {
        var day = dayList[i]
        if (!dataDay.includes(day)) {
          formatData.push([day, 0])
        }
      }
      // 展示数据的排序
      formatData.sort(function(a, b) {
        if (a[0] > b[0]) {
          return -1
        } else if (a[0] === b[0]) {
          return 0
        } else {
          return 1
        }
      })
      console.log('formatData')
      console.log(formatData)
      this.chart.setOption({
        xAxis: {
          type: 'time',
          data: anchor, // ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['近期短信发送量']
        },
        series: [
          {
            name: '近期短信发送量',
            itemStyle: {
              normal: {
                color: '#F56C6C',
                lineStyle: {
                  color: '#F56C6C',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'bar',
            data: formatData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      })
    }
  }
}
</script>
