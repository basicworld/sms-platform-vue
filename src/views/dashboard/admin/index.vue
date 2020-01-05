<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

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

import { smsSendSummary } from '@/api/fore'
// 折线图数据 测试展示用
const lineChartData = {
  chartData: [['2020-01-01', 37], ['2020-01-02', 3], ['2020-01-03', 36]]
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData
    }
  },
  mounted() {
    console.log('admin dashboard mounted')
    this.handleSetLineChartData()
  },
  methods: {
    handleSetLineChartData() {
      this.loading = true
      smsSendSummary()
        .then(res => {
          console.log('admin index res=')
          console.log(res)
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
