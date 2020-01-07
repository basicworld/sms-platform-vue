<template>
  <div class="container">
    <el-row class="box-space">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>编辑短信</span>
            </div>
            <div class="app-container">
              <el-form
                ref="form"
                :model="form"
                :rules="sendRules"
                label-width="80px"
              >
                <el-form-item label="短信内容" prop="message">
                  <el-input
                    ref="message"
                    v-model="form.message"
                    type="textarea"
                    name="message"
                    @blur="formatMessage()"
                  />
                </el-form-item>
                <el-form-item label="手机号" prop="phones">
                  <el-input
                    v-model="form.phones"
                    type="textarea"
                    @blur="formatPhones()"
                  />
                </el-form-item>
                <el-form-item>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击发送后不可撤销"
                    placement="bottom"
                  >
                    <el-button type="primary" @click="onSubmit">发送</el-button>
                  </el-tooltip>
                  <el-button @click="onCancel">清空</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>预览短信</span>
            </div>
            <div class="app-container wrap-word">
              <span style="color: #409EFF">短信内容</span>
              <br />
              <br />

              {{ msgsign }}{{ form.message }}
              <br />
              <el-divider></el-divider>
              <span style="color: #409EFF">手机号</span>
              <br />
              <br />
              {{ form.phones }}
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
export default {
  data() {
    return {
      msgsign: '【默认签名】',
      form: {
        message: '',
        phones: ''
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
          { required: true, trigger: 'blur', message: '必填项' },
          {
            type: 'string',
            min: 11,
            message: '手机号不允许小于11位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.loadSign()
  },
  methods: {
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
</style>
