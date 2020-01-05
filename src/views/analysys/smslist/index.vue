<template>
  <div class="container">
    <template>
      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <!-- height="250" -->
        <el-table-column
          fixed
          prop="id"
          label="短信ID"
          width="80"
        />
        <el-table-column
          fixed
          prop="phone"
          label="联系人(手机号)"
          width="140"
        />
        <el-table-column
          prop="orderId"
          label="业务ID"
          width="80"
        />
        <el-table-column
          prop="content"
          label="短信内容"
          min-width="300"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="170"
        />
        <el-table-column
          prop="stateDesc"
          label="状态描述"
          width="170"
        />
        <el-table-column
          prop="deliveryDate"
          label="发出时间"
          width="170"
        />
      </el-table>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        },
        {
          id: '1',
          phone: '12388889999',
          orderId: '3',
          content:
            '【百度】验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222，验证码为111222',
          createDate: '2019-12-12',
          stateDesc: '发送中',
          deliveryDate: '2019-12-12'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
