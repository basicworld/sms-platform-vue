<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-order">
          <svg-icon
            icon-class="guidec"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            任务
          </div>
          <count-to
            :start-val="0"
            :end-val="orderCount"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon
            icon-class="message"
            class-name="card-panel-icon"
          />
        </div>

        <div class="card-panel-description">
          <div class="card-panel-text">
            短信
          </div>
          <count-to
            :start-val="0"
            :end-val="smsCount"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">

        <div class="card-panel-icon-wrapper icon-group">
          <svg-icon
            icon-class="group"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            群组
          </div>
          <count-to
            :start-val="0"
            :end-val="groupCount"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-contact">
          <svg-icon
            icon-class="user"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            联系人
          </div>
          <count-to
            :start-val="0"
            :end-val="contactCount"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    panelData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contactCount: 0,
      groupCount: 0,
      orderCount: 0,
      smsCount: 0
    }
  },
  watch: {
    panelData: {
      deep: true,
      handler(val) {
        this.setPanelData(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initPanel()
    })
  },
  methods: {
    initPanel() {
      this.setPanelData(this.panelData)
    },
    setPanelData({ panelData } = {}) {
      console.log('setPanelData panelData=')
      console.log(panelData)
      this.contactCount = panelData.contactCount
      this.groupCount = panelData.groupCount
      this.orderCount = panelData.orderCount
      this.smsCount = panelData.smsCount
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    .icon-order {
      color: #409eff;
    }
    .icon-message {
      color: #f56c6c;
    }

    .icon-group {
      color: #67c23a;
    }
    .icon-contact {
      color: #e6a23c;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
