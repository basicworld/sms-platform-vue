<template>
  <div class="regist-container">
    <el-form
      ref="registForm"
      :model="registForm"
      :rules="registRules"
      class="regist-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registForm.username"
          placeholder="用户名（邮箱）"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="off"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="passwordConfirm">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="passwordConfirm"
          v-model="registForm.passwordConfirm"
          :type="passwordType"
          placeholder="再次输入密码"
          name="passwordConfirm"
          tabindex="3"
          auto-complete="off"
          @keyup.enter.native="handleRegist"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-row>
        <el-col :span="15">
          <el-form-item prop="captcha">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="captcha"
              v-model="registForm.captcha"
              placeholder="图片验证码"
              name="captcha"
              type="text"
              tabindex="3"
              auto-complete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="8">
          <img
            ref="captcha_img"
            src="/captcha"
            title="点击替换"
            alt="验证码"
            style="cursor: pointer; width:150px; height: 52px;"
            @click="reloadCaptcha"
          />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item prop="verifycode">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              ref="verifycode"
              v-model="registForm.verifycode"
              placeholder="邮箱验证码"
              name="verifycode"
              type="text"
              tabindex="3"
              auto-complete="off"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="8">
          <el-button
            size="small"
            style="width:100%;margin-top: 10px;"
            @click.native.prevent="sendVerifyCode"
          >发送邮箱验证码</el-button>
        </el-col>
      </el-row>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegist"
      >注册</el-button>

      <div class="tips">
        <span style="margin-right:20px;">
          <a
            href="#/login"
            style="color: #fff"
          >已有账号，去登录</a>
        </span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { verifycodeSend, regist } from '@/api/user'
import { checkPass } from '@/utils/validate'
import md5 from 'js-md5'

export default {
  name: 'Regist',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == null || !validUsername(value)) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (checkPass(value) < 3) {
        callback(
          new Error('密码必须包括大写、小写字母和数字，并且长度为8-16位')
        )
      } else {
        callback()
      }
    }
    const validatePasswordConfirm = (rule, value, callback) => {
      if (checkPass(value) < 3) {
        callback(
          new Error('密码必须包括大写、小写字母和数字，并且长度为8-16位')
        )
      } else if (this.registForm.password !== value) {
        callback(new Error('两次输入密码不相等'))
      } else {
        callback()
      }
    }
    return {
      registForm: {
        username: '',
        password: '',
        passwordConfirm: '',
        captcha: '',
        verifycode: ''
      },
      registRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUsername },
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePassword },
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        passwordConfirm: [
          {
            required: true,
            trigger: 'change',
            validator: validatePasswordConfirm
          },
          {
            required: true,
            trigger: 'blur',
            validator: validatePasswordConfirm
          }
        ],
        verifycode: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ],
        captcha: [
          {
            required: true,
            trigger: 'blur',
            message: '必填项'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 发送邮箱验证码
    sendVerifyCode() {
      if (
        this.registForm.username === null ||
        this.registForm.username.length < 1
      ) {
        this.$message({
          message: '邮箱为必填项',
          type: 'warning'
        })
        return false
      }
      var reqData = {} // 请求参数
      reqData.username = this.registForm.username.trim()
      verifycodeSend(reqData)
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
          console.log('regist index verifycodeSend error')
          this.loading = false
        })
    },
    reloadCaptcha() {
      console.log('reloadCaptcha...')
      this.$refs.captcha_img.setAttribute('src', '/captcha?' + Math.random())
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    clear() {
      this.registForm.username = ''
      this.registForm.password = ''
      this.registForm.passwordConfirm = ''
      this.registForm.captcha = ''
      this.registForm.verifycode = ''
    },
    // 点击注册按钮
    handleRegist() {
      this.$refs.registForm.validate(valid => {
        if (valid) {
          this.loading = true
          var reqData = {} // 请求参数
          reqData.username = this.registForm.username.trim()
          reqData.password = md5(this.registForm.password.trim())
          reqData.captcha = this.registForm.captcha.trim()
          reqData.verifyCode = this.registForm.verifycode.trim()
          console.log(reqData)
          regist(reqData)
            .then(res => {
              if (res.code === 0) {
                this.clear()
                this.$message({
                  message: res.msg,
                  type: 'success',
                  duration: 10000
                })
                this.$router.push({ path: this.redirect || '/' })
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
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .regist-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.regist-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.regist-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .regist-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 80px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
