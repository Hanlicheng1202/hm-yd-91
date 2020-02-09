<template>
  <div class="container">
    <!-- 头部 -->
    <van-nav-bar title="我的头条" right-text="搜索" v-if="isShow" fixed @click-right="$router.push('/search')"></van-nav-bar>
    <!-- 二级容器  首页视频 问答 我的 -->
    <div class="my-wrapper" :class="{noTop:!isShow}">
      <!-- 采用keep-alive 对组件进行缓存 -->
      <keep-alive>
      <router-view></router-view>
      </keep-alive>

    </div>
    <!-- 脚部 -->
    <van-tabbar >
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/videos">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  computed: {
    // 是否显示头部navvar
    isShow () {
      return this.$route.path !== '/user'
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>
