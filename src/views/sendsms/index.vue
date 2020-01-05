<template>
  <div class="container">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-card class="box-card">
            <div
              slot="header"
              class="clearfix"
            >
              <span>编辑短信</span>
            </div>
            <div class="app-container">

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
                    type="text"
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
                    type="text"
                    @blur="formatPhones()"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="onSubmit"
                  >发送</el-button>
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
            <div
              slot="header"
              class="clearfix"
            >
              <span>预览短信</span>
            </div>
            <div class="app-container">
              <el-tag>短信内容</el-tag><br>
              {{ form.message }}
              <br><br>
              <el-tag>手机号</el-tag><br>
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

export default {
  data() {
    return {
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
  methods: {
    onSubmit() {
      console.log(this.form.message)
      this.$message('message=' + this.form.message)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          console.log('valid form')
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
.container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
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
  margin: 0 15px;
}
.line {
  text-align: center;
}
</style>
