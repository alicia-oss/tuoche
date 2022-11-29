<template>
    <div class="main">
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
      >
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="$t('user.login.message-invalid-credentials')" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.username.placeholder')"
              v-decorator="[
                'account',
                {rules: [{ required: true, message: $t('user.userName.required') }], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-decorator="[
                'password',
                {rules: [{ required: true, message: $t('user.password.required') }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input-password>
          </a-form-item>

        <a-form-item>
          <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">{{ $t('user.login.remember-me') }}</a-checkbox>
          <router-link
            :to="{ name: 'recover', params: { user: 'aaa'} }"
            class="forge-password"
            style="float: right;"
          >{{ $t('user.login.forgot-password') }}</router-link>
        </a-form-item>

        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginBtn"
            :disabled="loginBtn"
          >{{ $t('user.login.login') }}</a-button>
        </a-form-item>

        <div class="user-login-other"></div>
      </a-form>
    </div>
</template>


<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import {asyncRouterMap} from "@/config/router.config";



export default {
  name:"Login",
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      loginBtn: false,
      isLoginError: false,
      form: this.$form.createForm(this),
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'Logout','GetInfo']),
    // handler

    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        Login
      } = this
      let validateFieldsKey = ['account','password'];
      validateFields(validateFieldsKey,{force:true},(err,values)=>{
        if (!err){
          const loginParams = { ...values };
          Login(loginParams).then((res) => {
            if(res.success){
              this.loginSuccess(res)
            }
            else{
              this.requestFailed(res)
            }
          })
            .finally(() => {
              this.loginBtn = false
            })
        }
      })
    },

    loginSuccess (res) {
      console.log(res)
      this.GetInfo().then(()=>{
        this.setPermission();
      });
      this.$router.push({ path: '/account' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },

    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: err.message|| '请求出现错误，请稍后再试',
        duration: 4
      })
    },

    setPermission(){
      let role = this.$store.getters.roles;
      const routers = asyncRouterMap[0].children
      routers.forEach((item)=>{
        if(item.meta.permission.
        find((a)=>{
          return role.find((b)=>{
            // console.log(a,b)
            return a === b;
          })
        }) !== undefined  ){
          item.hidden = false
        }
        else {
          item.hidden = true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>