<template>
  <div class="container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.orderId"
        placeholder="搜索任务ID"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <!-- :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)" -->
      <!-- height="250" -->
      <el-table-column fixed prop="id" label="任务ID" width="80" />
      <el-table-column
        prop="contentSample"
        label="短信内容"
        min-width="300"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="createDate"
        label="创建时间"
        width="170"
        :formatter="formatCreateDate"
      />
      <el-table-column prop="numOfTotal" label="短信总条数" width="100" />
      <el-table-column prop="numOfUnsend" label="待处理" width="100" />
      <el-table-column prop="numOfInSendQueue" label="排队处理中" width="100" />
      <el-table-column prop="numOfSendSuccess" label="发送成功" width="100" />
      <el-table-column prop="numOfSendFailed" label="发送失败" width="100" />
    </el-table>
    <pagination
      v-show="total >= 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getData"
    />
  </div>
</template>
<script>
// import axios from 'axios'
import { ordersQuery } from '@/api/sms'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { timestampToTime } from '@/utils/index'
export default {
  name: 'Orders',
  components: { Pagination },

  data() {
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        orderId: undefined
      },
      //   currentPage: 1, // 默认显示页面为1
      //   pagesize: 10, //    每页的数据条数
      tableData: []
    }
  },
  mounted() {},
  created() {
    this.getData()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    formatCreateDate(row, column) {
      if (row.createDate == null || row.createDate === '') {
        return ''
      } else {
        return timestampToTime(row.createDate)
      }
    },
    getData() {
      var reqData = {} // 请求参数
      reqData.page = this.listQuery.page
      reqData.limit = this.listQuery.limit
      if (this.listQuery.orderId && this.listQuery.orderId !== '') {
        reqData.orderId = this.listQuery.orderId
      }
      //   console.log(this.listQuery)
      ordersQuery(reqData)
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.total = res.count // 前后端命名不同的转换
            this.tableData = res.data
          }
          this.loading = false
        })
        .catch(() => {
          console.log('error')
          this.loading = false
        })
    },
    // 每页下拉显示数据
    handleSizeChange(size) {
      this.listQuery.limit = size
      this.listQuery.page = 1
      this.getData()
    },
    // 点击第几页
    handleCurrentChange(currentPage) {
      this.listQuery.page = currentPage
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
}
</style>
