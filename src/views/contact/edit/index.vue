<template>
  <div class="container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.contactSearchKey"
        placeholder="筛选姓名或手机号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.groupId"
        placeholder="筛选群组"
      >
        <el-option
          v-for="group in allContactGroups"
          :key="group.id"
          :label="group.groupName"
          :value="group.id"
        >{{ group.groupName }}</el-option>
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <!-- height="250" -->
      <el-table-column
        fixed
        prop="id"
        label="联系人ID"
        width="80"
      />
      <el-table-column
        fixed
        prop="name"
        label="姓名"
        min-width="120"
      />
      <el-table-column
        prop="phone"
        label="手机号"
        width="120"
      />
      <el-table-column
        prop="groupDesc"
        label="所在分组"
        min-width="120"
        :show-overflow-tooltip="true"
        :formatter="formatGroupDesc"
      />
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="deleteData(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total >= 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getData"
    />
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="updateForm"
        :model="updateForm"
        :rules="sendRules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                ref="name"
                v-model="updateForm.name"
                type="text"
                name="name"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="手机号"
              prop="phone"
            >
              <el-input
                v-model="updateForm.phone"
                type="text"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="选择群组"
          prop="selectContactGroups"
        >
          <el-checkbox-group v-model="updateForm.selectContactGroups">
            <el-checkbox
              v-for="group in allContactGroups"
              :key="group.id"
              :label="group.id"
              name="group.groupName"
            >
              {{ group.groupName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="updateData()"
        >提交</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import axios from 'axios'
import {
  listContact,
  updateContact,
  deleteContact,
  uniquePhoneCheck,
  listContactGroup
} from '@/api/contact'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { timestampToTime } from '@/utils/index'
export default {
  name: 'Orders',
  components: { Pagination },

  data() {
    // 手机号格式校验
    const validatePhone = (rule, value, callback) => {
      var result = value.match(/1[2,3,4,5,6,7,8,9]{1}[\d]{9}/g)
      console.log('validatePhone value=' + value)
      if (value.length !== 11 || result == null) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    // 重复手机号校验
    const uniquePhone = (rule, value, callback) => {
      this.loading = true
      var reqData = {} // 请求参数
      reqData.phone = value
      uniquePhoneCheck(reqData)
        .then(res => {
          console.log(res)
          if (res.code !== 0) {
            callback(new Error(res.msg))
          } else {
            callback()
          }
          this.loading = false
        })
        .catch(() => {
          console.log('error')
          this.loading = false
        })
    }
    // 至少选择一个群组
    const validateSelectGroups = (rule, value, callback) => {
      console.log('validateSelectGroups value=' + value)

      if (value == null || value.length < 1) {
        callback(new Error('至少选择一个群组'))
      } else {
        callback()
      }
    }
    return {
      dialogStatus: '',
      textMap: {
        update: '编辑联系人',
        create: '新增联系人'
      },
      allContactGroups: [],
      defaultGroup: [{ id: -1, groupName: '所有分组' }],
      updateForm: {
        id: '',
        userId: '',
        name: '',
        phone: '',
        contactGroupIds: '',
        selectContactGroups: []
      },
      dialogFormVisible: false,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        contactSearchKey: undefined,
        groupId: -1
      },
      //   currentPage: 1, // 默认显示页面为1
      //   pagesize: 10, //    每页的数据条数
      tableData: [],
      sendRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ],
        phone: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          },
          {
            required: true,
            trigger: 'blur',
            validator: validatePhone
          },
          {
            required: true,
            trigger: 'blur',
            validator: uniquePhone
          }
        ],
        selectContactGroups: [
          {
            required: true,
            trigger: 'change',
            validator: validateSelectGroups
          }
        ]
      }
    }
  },
  mounted() {},
  created() {
    this.getData()
    this.getGroupData()
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
    formatGroupDesc(row, column) {
      var arr = []
      for (var i = 0; i < row.contactGroupList.length; i++) {
        arr.push(row.contactGroupList[i].groupName)
      }
      return arr.join(',')
    },
    formatDeliveryDate(row, column) {
      if (row.deliveryDate == null || row.deliveryDate === '') {
        return ''
      } else {
        return timestampToTime(row.deliveryDate)
      }
    },
    getData() {
      var reqData = {} // 请求参数
      reqData.page = this.listQuery.page
      reqData.limit = this.listQuery.limit
      if (
        this.listQuery.contactSearchKey &&
        this.listQuery.contactSearchKey !== ''
      ) {
        reqData.searchKey = this.listQuery.contactSearchKey
      }
      if (this.listQuery.groupId && this.listQuery.groupId !== '' && this.listQuery.groupId !== -1) {
        reqData.groupId = this.listQuery.groupId
      }
      console.log(reqData)
      listContact(reqData)
        .then(res => {
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
    // 获取群组列表
    getGroupData() {
      var reqData = {} // 请求参数
      reqData.page = this.listQuery.page
      reqData.limit = 999
      listContactGroup(reqData)
        .then(res => {
          if (res.code === 0) {
            this.total = res.count // 前后端命名不同的转换
            res.data.map(function(group) {
              group.groupName = group.groupName + '(' + group.contactNum + '人)'
            })
            // 排序 默认分组在前面  然后按群组名称排序
            res.data.sort(function(a, b) {
              if (a.type !== b.type) {
                return a.type - b.type
              } else {
                if (a.groupName > b.groupName) {
                  return 1
                } else if (a.groupName < b.groupName) {
                  return -1
                } else {
                  return 0
                }
              }
            })
            this.allContactGroups = this.defaultGroup.concat(res.data)
          }
          this.loading = false
        })
        .catch(() => {
          console.log('error')
          this.loading = false
        })
    },
    deleteData(row) {
      this.$confirm('您确定删除吗？')
        .then(_ => {
          var reqData = {} // 请求参数
          reqData.id = row.id
          deleteContact(reqData)
            .then(res => {
              if (res.code === 0) {
                this.$message(res.msg)
                this.getData()
                this.dialogFormVisible = false
              } else {
                this.$message({
                  message: res.msg,
                  type: 'warning'
                })
              }
              this.loading = false
            })
            .catch(() => {
              console.log('error')
              this.loading = false
            })
        })
        .catch(_ => {})
    },
    handleUpdate(row) {
      this.getGroupData()
      //   this.updateForm = Object.assign({}, row) // copy obj
      this.updateForm.id = row.id
      this.updateForm.userId = row.userId
      this.updateForm.name = row.name
      this.updateForm.phone = row.phone
      this.updateForm.contactGroupIds = row.contactGroupIds
      // selectContactGroups

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.textMap.update = '编辑联系人(ID=' + this.updateForm.id + ')'
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
      this.updateForm.selectContactGroups = []
      for (var i = 0; i < row.contactGroupList.length; i++) {
        this.updateForm.selectContactGroups.push(row.contactGroupList[i].id)
      }
    },
    updateData() {
      var reqData = {} // 请求参数
      reqData.id = this.updateForm.id
      reqData.userId = this.updateForm.userId
      reqData.name = this.updateForm.name
      reqData.phone = this.updateForm.phone
      reqData.contactGroupIds = this.updateForm.selectContactGroups.join(',')

      console.log(reqData)
      updateContact(reqData)
        .then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message(res.msg)
            this.getData()
            this.dialogFormVisible = false
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
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
