<template>
  <div class="container">
    <panel-group
      :panel-data="panelGroupData"
      @handleSetLineChartData="handleSetLineChartData"
    />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

  </div>
</template>

<script>
// 4个面板
import PanelGroup from './components/PanelGroup'
// 一个折线图
import LineChart from './components/LineChart'

import { smsSendSummary, foreReport } from '@/api/fore'
// 折线图数据
const lineChartData = {
  chartData: []
}
// 面板数据
const panelGroupData = {
  panelData: {
    contactCount: 0,
    groupCount: 0,
    orderCount: 0,
    queueCount: 0,
    smsCount: 0,
    userCount: 0
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      panelGroupData: panelGroupData,
      lineChartData: lineChartData
    }
  },
  mounted() {
    console.log('admin dashboard mounted')
    this.handleSetLineChartData()
    this.handleSetPanelGroupData()
  },
  methods: {
    handleSetPanelGroupData() {
      this.loading = true
      foreReport()
        .then(res => {
          if (res.code === 0) {
            console.log('handleSetPanelGroupData res.data=')
            console.log(res.data)
            this.panelGroupData = { panelData: res.data }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          this.loading = false
        })
        .catch(() => {
          console.log('admin index error')
          this.loading = false
        })
    },
    handleSetLineChartData() {
      this.loading = true
      smsSendSummary()
        .then(res => {
          if (res.code === 0) {
            this.lineChartData = { chartData: res.data }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          this.loading = false
        })
        .catch(() => {
          console.log('admin index error')
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
