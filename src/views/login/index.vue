<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
      label-position="left">

      <div class="title-container">
        <h3 class="title">尚品甄选后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
          tabindex="1" autocomplete="on" />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" autocomplete="on" @keyup="checkCapslock"
            @blur="capsTooltip = false" @keyup.enter="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="captcha">
        <div class="captcha">
          <span class="svg-container">
            <svg-icon icon-class="component"/>
          </span>
          <el-input
              ref="captcha"
              class="text"
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
          ></el-input>
          <img :src="captchaSrc" @click="refreshCaptcha"  alt="验证码"/>
        </div>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.prevent="handleLogin">
        Login</el-button>

<!--      <div style="position:relative">-->
<!--        <div class="tips">-->
<!--          <span>Username : admin</span>-->
<!--          <span>Password : any</span>-->
<!--        </div>-->
<!--        <div class="tips">-->
<!--          <span style="margin-right:18px;">Username : editor</span>-->
<!--          <span>Password : any</span>-->
<!--        </div>-->

<!--        <el-button class="thirdparty-button" type="primary" @click="showDialog = true">-->
<!--          Or connect with-->
<!--        </el-button>-->
<!--      </div>-->
    </el-form>

    <el-dialog title="Or connect with" v-model="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { validUsername } from '@/utils/validate';
import { defineComponent } from 'vue';
import SocialSign from './components/SocialSignin.vue';
import type { FormItemRule } from 'element-plus';
import type { IForm } from '@/types/element-plus';
import store from '@/store';
import { getValidateCode } from '@/api/user';

interface QueryType {
  // 自定义key 任意字符串
  [propname:string]:string
}

export default defineComponent({
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername: FormItemRule['validator'] = (_rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'));
      } else {
        callback();
      }
    };
    const validatePassword: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'));
      } else {
        callback();
      }
    };
    const validateCaptcha: FormItemRule['validator'] = (_rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('请正确输入验证码'));
      } else {
        callback();
      }
    };
    return {
      captchaSrc: '',
      loginForm: {
        username: 'admin',
        password: '111111',
        captcha: '',
        codeKey: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        captcha: [{ required: true, trigger: 'blur', validator: validateCaptcha }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    this.refreshCaptcha();
    if (this.loginForm.username === '') {
      (this.$refs.username as HTMLElement).focus();
    } else if (this.loginForm.password === '') {
      (this.$refs.password as HTMLElement).focus();
    } else if (this.loginForm.captcha === '') {
      (this.$refs.captcha as HTMLElement).focus();
    }
  },
  unmounted() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    async refreshCaptcha() {
      const { data } = await getValidateCode();
      this.loginForm.codeKey = data.codeKey;
      this.captchaSrc = data.codeValue;
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z');
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        (this.$refs.password as HTMLElement).focus();
      });
    },
    handleLogin() {
      (this.$refs.loginForm as IForm).validate(valid => {
        return new Promise((resolve, reject) => {
          if (valid) {
            this.loading = true;
            store.user().login(this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              }).finally(() => {
                resolve();
              });
          } else {
            console.log('error submit!!');
            reject();
          }
        });
      });
    },
    getOtherQuery(query:QueryType) {
      return Object.keys(query).reduce((acc:QueryType, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       store.user().LoginByThirdparty(codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
});
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-plus css */
.login-container {
  .el-input {
    height: 47px;
    width: 85%;

    .el-input__wrapper,
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      box-shadow: none;
    }

    input {
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor  !important;
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
.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  cursor: pointer;
  margin-left: 20px;
}
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
