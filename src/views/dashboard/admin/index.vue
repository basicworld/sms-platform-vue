<template>
  <div class="dashboard-editor-container">
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
    contactCount: 3,
    groupCount: 1,
    orderCount: 8,
    queueCount: 0,
    smsCount: 13,
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
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: 100vh;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
