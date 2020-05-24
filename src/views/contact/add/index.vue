<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>手动添加</span>
      </div>
      <div class="app-container">
        <el-form ref="form" :model="form" :rules="sendRules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input
                  ref="name"
                  v-model="form.name"
                  type="text"
                  name="name"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" type="text" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="选择群组" prop="selectContactGroups">
            <el-checkbox-group v-model="form.selectContactGroups">
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
        <span>批量导入</span>
      </div>
      <div class="app-container">
        <upload-excel-component
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        />
        <el-table
          :data="excelTableData"
          border
          highlight-current-row
          style="width: 100%;margin-top:20px;"
        >
          <el-table-column fixed prop="name" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="note" label="校验结果" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
import { addContact, listContactGroup, uniquePhoneCheck } from '@/api/contact'
import UploadExcelComponent from './components/UploadExcel/index.vue'

export default {
  name: 'AddContact',
  components: { UploadExcelComponent },
  data() {
    // 手机号格式校验
    const validatePhone = (rule, value, callback) => {
      var result = value.match(/1[2,3,4,5,6,7,8,9]{1}[\d]{9}/g)
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
      if (value.length < 1 || value == null) {
        callback(new Error('至少选择一个群组'))
      } else {
        callback()
      }
    }
    return {
      excelTableData: [],
      excelTableHeader: [],
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
        limit: 99,
        importance: undefined,
        title: undefined,
        type: undefined
      },
      tableData: [],
      allContactGroups: [],
      form: {
        name: '',
        phone: '',
        contactGroupIds: '',
        selectContactGroups: []
      },
      updateForm: {
        id: '',
        userId: '',
        name: '',
        phone: '',
        contactGroupIds: ''
      },
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
  },
  methods: {
    getData() {
      var reqData = {} // 请求参数
      reqData.page = this.listQuery.page
      reqData.limit = 999
      //   console.log(this.listQuery)
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
            this.allContactGroups = res.data
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
          var reqData = {} // 请求参数
          reqData.name = this.form.name.trim()
          reqData.phone = this.form.phone.trim()
          reqData.contactGroupIds = this.form.selectContactGroups.join(',')
          addContact(reqData)
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
      this.form.name = ''
      this.form.phone = ''
      this.form.selectContactGroups = []
    },
    // 处理excel
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 处理excel
    handleSuccess({ results }) {
      this.excelTableData = results
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
