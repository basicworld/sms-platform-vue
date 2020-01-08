<template>
  <div class="container">
    <el-row class="box-space">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>编辑短信</span>
            </div>
            <div class="">
              <el-form
                ref="form"
                :model="form"
                :rules="sendRules"
                label-width="80px"
              >
                <el-form-item
                  label="短信内容"
                  prop="message"
                >
                  <el-input
                    ref="message"
                    v-model="form.message"
                    type="textarea"
                    name="message"
                    @blur="formatMessage()"
                  />
                </el-form-item>
                <el-form-item
                  label="手机号"
                  prop="phones"
                >
                  <el-input
                    v-model="form.phones"
                    type="textarea"
                    @blur="formatPhones()"
                  />
                </el-form-item>
                <el-form-item
                  label="联系人"
                  prop="selectContacts"
                >
                  <el-button
                    size="small"
                    @click="handleSelectContact()"
                  >选择联系人</el-button>
                  <el-checkbox-group v-model="form.selectContacts">
                    <el-checkbox
                      v-for="contact in allContacts"
                      :key="contact.id"
                      :label="contact.id"
                      name="contact.name"
                    >
                      {{ contact.name }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="选择群组"
                  prop="selectContactGroups"
                >
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
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击发送后不可撤销"
                    placement="bottom"
                  >
                    <el-button
                      type="primary"
                      @click="onSubmit"
                    >发送</el-button>
                  </el-tooltip>
                  <el-button @click="onCancel">清空</el-button>
                </el-form-item>
              </el-form>
              <el-dialog
                title="选择联系人"
                width="66%"
                :visible.sync="dialogFormVisible"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form
                      :inline="true"
                      :rules="sendRules"
                      label-width="80px"
                    >
                      <el-form-item
                        label=""
                        prop="groupName"
                      >
                        <el-input
                          ref="groupName"
                          type="text"
                          name="groupName"
                        />
                      </el-form-item>
                      <el-button
                        type="primary"
                        @click="onContactSuggest"
                      >查询</el-button>
                    </el-form>
                  </el-col>
                  <el-col :span="12">
                    <div class="preview-head">
                      <span>已选择联系人</span>
                    </div>
                  </el-col>
                </el-row>

                <div
                  slot="footer"
                  class="dialog-footer"
                >
                  <el-button
                    type="primary"
                    @click="updateData()"
                  >保存</el-button>
                  <el-button @click="dialogFormVisible = false">取消</el-button>
                </div>
              </el-dialog>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>预览短信</span>
            </div>
            <div class=" wrap-word">
              <div class="preview-head">
                <span>短信内容</span>
              </div>
              <div>{{ msgsign }}{{ form.message }}</div>
              <el-divider></el-divider>
              <div class="preview-head">
                <span style="color: #409EFF">手机号</span>
              </div>
              <div>{{ form.phones }}</div>
              <el-divider></el-divider>
              <div class="preview-head">
                <span style="color: #409EFF">已选群组</span>
              </div>
              <div>{{ previewSelectGroups() }}</div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { extractPhones } from '@/utils/validate'
import { sendSms, signQuery } from '@/api/sms'
import { listContactGroup } from '@/api/contact'
export default {
  data() {
    // 手机号  分组 联系人 至少选择一个
    const oneContactAtLeast = (rule, value, callback) => {
      var a = 1
      var b = 1
      var c = 1
      if (this.form.phones === null || this.form.phones === '') {
        a = 0
      }
      if (
        this.form.selectContacts == null ||
        this.form.selectContacts.length === 0
      ) {
        b = 0
      }
      if (
        this.form.selectContactGroups === null ||
        this.form.selectContactGroups.length === 0
      ) {
        c = 0
      }
      if (a + b + c < 1) {
        callback(new Error('手机号、联系人、群组至少选择一个'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      dialogStatus: '',

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
      allContacts: [{ id: 1, name: 'cc' }],
      msgsign: '【默认签名】',
      form: {
        message: '',
        phones: '',
        contactGroupIds: '',
        contactIds: '',
        selectContactGroups: [],
        selectContacts: []
      },
      sendRules: {
        message: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ],
        phones: [
          // { required: true, trigger: 'blur', message: '必填项' },
          {
            type: 'string',
            min: 11,
            message: '手机号不允许小于11位',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: oneContactAtLeast
          },
          {
            trigger: 'change',
            validator: oneContactAtLeast
          }
        ],
        selectContactGroups: [
          {
            trigger: 'change',
            validator: oneContactAtLeast
          }
        ],
        selectContacts: [
          {
            trigger: 'change',
            validator: oneContactAtLeast
          }
        ]
      }
    }
  },
  mounted() {
    this.loadSign()
    this.getData()
  },
  methods: {
    handleSelectContact() {
      this.dialogFormVisible = true
    },
    previewSelectGroups() {
      var form = this.form
      return this.allContactGroups
        .filter(function(x) {
          return form.selectContactGroups.indexOf(x.id) >= 0
        })
        .map(x => {
          return x.groupName
        })
        .join(',')
    },
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
            this.allContactGroups = res.data.filter(function(x) {
              return x.contactNum > 0
            })
          }
          this.loading = false
        })
        .catch(() => {
          console.log('error')
          this.loading = false
        })
    },
    loadSign() {
      signQuery()
        .then(res => {
          if (res.code === 0) {
            this.msgsign = res.data
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
    onSubmit() {
      console.log(this.form.message)

      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          console.log('valid form')
          sendSms(this.form)
            .then(res => {
              if (res.code === 0) {
                this.$message(res.msg)
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
      this.form.message = ''
      this.form.phones = ''
    },
    formatPhones() {
      var phones = extractPhones(this.form.phones)
      this.form.phones = phones
    },
    formatMessage() {
      this.form.message = this.form.message.trim()
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
.preview-head {
  padding-bottom: 10px;
  color: #409eff;
}
</style>
