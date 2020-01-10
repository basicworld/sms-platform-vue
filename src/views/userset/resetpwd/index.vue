<template>
  <div class="container">
    <el-card class="box-card">
      <div class="app-container">
        <el-form
          ref="form"
          :model="form"
          :rules="sendRules"
          label-width="80px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="旧密码"
                prop="oldPassword"
              >
                <el-input
                  ref="oldPassword"
                  v-model="form.oldPassword"
                  type="password"
                  name="oldPassword"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="新密码"
                prop="password"
              >
                <el-input
                  ref="password"
                  v-model="form.password"
                  type="password"
                  name="password"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="确认密码"
                prop="passwordConfirm"
              >
                <el-input
                  ref="passwordConfirm"
                  v-model="form.passwordConfirm"
                  type="password"
                  name="passwordConfirm"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
            >提交</el-button>
            <el-button @click="onCancel">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { checkPass } from '@/utils/validate'
import { changePassword } from '@/api/user'
import md5 from 'js-md5'
export default {
  data() {
    // d 密码强度
    const pwdCheck = (rule, value, callback) => {
      if (checkPass(value) < 3) {
        callback(
          new Error('密码必须包括大写、小写字母和数字，并且长度为8-16位')
        )
      } else {
        callback()
      }
    }
    // 两次输入密码一致性校验
    const pwdConfirmCheck = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('密码必须同时包含字母和数字，不少于8位'))
      } else if (this.form.password !== this.form.passwordConfirm) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      listLoading: true,
      form: {
        oldPassword: '',
        password: '',
        passwordConfirm: ''
      },
      sendRules: {
        oldPassword: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          },
          {
            trigger: 'change',
            validator: pwdCheck
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          },
          {
            trigger: 'change',
            validator: pwdCheck
          }
        ],
        passwordConfirm: [
          {
            trigger: 'change',
            validator: pwdCheck
          },
          {
            required: true,
            trigger: 'change',
            validator: pwdConfirmCheck
          }
        ]
      }
    }
  },
  mounted() {},
  created() {},
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var reqData = {} // 请求参数
          reqData.oldPassword = md5(this.form.oldPassword.trim())
          reqData.password = md5(this.form.password.trim())
          changePassword(reqData)
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
      this.form.oldPassword = ''
      this.form.password = ''
      this.form.passwordConfirm = ''
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
