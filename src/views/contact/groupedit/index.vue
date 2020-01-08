<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增群组</span>
      </div>
      <div class="app-container">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
          :rules="sendRules"
          label-width="80px"
        >
          <el-form-item label="群组名称" prop="groupName">
            <el-input
              ref="groupName"
              v-model="form.groupName"
              type="text"
              name="groupName"
            />
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="form.note" type="text" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="onCancel">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <br />
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>群组列表</span>
      </div>
      <div class="app-container">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column fixed prop="id" label="群组ID" width="80" />
          <el-table-column prop="groupName" label="群组名称" min-width="120" />
          <el-table-column prop="note" label="备注" min-width="170" />
          <el-table-column prop="contactNum" label="联系人数量" width="120" />
          <el-table-column
            label="操作"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
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
            :inline="true"
            :model="updateForm"
            :rules="sendRules"
            label-width="80px"
          >
            <el-form-item label="群组名称" prop="groupName">
              <el-input
                ref="groupName"
                v-model="updateForm.groupName"
                type="text"
                name="groupName"
              />
            </el-form-item>
            <el-form-item label="备注" prop="note">
              <el-input v-model="updateForm.note" type="text" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="updateData()">提交</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  addContactGroup,
  listContactGroup,
  updateContactGroup,
  deleteContactGroup
} from '@/api/contact'
export default {
  data() {
    return {
      dialogStatus: '',
      textMap: {
        update: '编辑群组',
        create: '新增群组'
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
        orderId: undefined
      },
      tableData: [],
      form: {
        groupName: '',
        note: ''
      },
      updateForm: {
        id: '',
        userId: '',
        groupName: '',
        note: ''
      },
      temp: {
        groupName: '',
        note: ''
      },
      sendRules: {
        groupName: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ]
      }
    }
  },
  mounted() {},
  created() {
    this.getData()
  },
  methods: {
    handleUpdate(row) {
      this.updateForm = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.textMap.update = '编辑群组(ID=' + this.updateForm.id + ')'
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate()
      })
    },
    updateData() {
      var reqData = {} // 请求参数
      reqData.id = this.updateForm.id
      reqData.userId = this.updateForm.userId
      reqData.groupName = this.updateForm.groupName
      reqData.note = this.updateForm.note
      console.log(reqData)
      updateContactGroup(reqData)
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
    deleteData(row) {
      this.$confirm('您确定删除吗？')
        .then(_ => {
          var reqData = {} // 请求参数
          reqData.id = row.id
          deleteContactGroup(reqData)
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
        })
        .catch(_ => {})
    },
    getData() {
      var reqData = {} // 请求参数
      reqData.page = this.listQuery.page
      reqData.limit = this.listQuery.limit
      if (this.listQuery.orderId && this.listQuery.orderId !== '') {
        reqData.orderId = this.listQuery.orderId
      }
      //   console.log(this.listQuery)
      listContactGroup(reqData)
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
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          console.log('valid form')
          addContactGroup(this.form)
            .then(res => {
              if (res.code === 0) {
                this.$message(res.msg)
                this.getData()
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel() {
      this.clear()
      this.$message({
        message: '已清空',
        type: 'warning'
      })
    },
    clear() {
      this.form.groupName = ''
      this.form.note = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.box-space {
  margin: -7.5px;
}
.box-space > * {
  padding: 7.5px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  // width: 480px;
  margin: 0;
}
.line {
  text-align: center;
}
.wrap-word {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>
