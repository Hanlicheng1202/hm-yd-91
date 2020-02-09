<template>
  <div class="container">
    <van-nav-bar left-arrow title="登录" @click-left="$router.back()"></van-nav-bar>
    <van-cell-group class="main">
      <van-field label="用户名" v-model.trim="loginParams.mobile" placeholder="请输入用户名" @blur="checkMobile" :error-message="errMsg.mobile"/>
      <van-field label="验证码" v-model.trim="loginParams.code" placeholder="请输入验证码" @blur="checkCode" :error-message="errMsg.code">
            <van-button  slot="button" size="mini" type="primary">
                发送验证码
            </van-button>
        </van-field>
    </van-cell-group>
    <div class="btn_box">
        <van-button type="info"  block round @click="login">登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      loginParams: {
        mobile: '18810086387',
        code: '246810'
      },
      // 提示信息
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']),
    checkMobile () {
      // 判断是否为空
      if (!this.loginParams.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      }
      // 判断格式
      if (!/^1[3-9]\d{9}$/.test(this.loginParams.mobile)) {
        this.errMsg.mobile = '手机号格式不正确'
      }
      // 清除错误信息
      this.errMsg.mobile = ''
      return true
    },
    checkCode () {
      // 判断是否为空
      if (!this.loginParams.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      }
      // 判断格式
      if (!/^\d{6}$/.test(this.loginParams.code)) {
        this.errMsg.code = '验证码输入错误'
        return false
      }
      // 清除错误信息
      this.errMsg.code = ''
      return true
    },
    async login () {
      if (this.checkMobile() && this.checkCode()) {
        // 获取结果
        const data = await login(this.loginParams)
        // 更新用户信息
        this.updateUser({ user: data })
        this.$notify({ type: 'success', message: '登录成功' })
        let { redirectUrl } = this.$route.query
        this.$router.push(redirectUrl || '/')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn_box{
  padding: 20px;
}
.main {
  margin-top: 100px;
}
</style>
