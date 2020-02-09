<template>
   <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小智同学"></van-nav-bar>
    <div class="chat-list" ref="list">
       <!-- 这个div要展示两种场景 一种是小智说的 一种是我说的 -->
      <div :class="{ left : item.name === 'xz',right : item.name !== 'xz'}" class="chat-item" v-for="(item,index) in list" :key="index">
        <van-image fit="cover" round :src="XZImg" v-if="item.name==='xz'"/>
        <div class="chat-pao">{{item.msg}}</div>
         <van-image  fit="cover" round :src="photo" v-if="item.name!=='xz'"/>
      </div>
      <!-- <div class="chat-item right">
        <div class="chat-pao">ewqewq</div>
        <van-image  fit="cover" round :src="photo" />
      </div> -->
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import XZImg from '@/assets/images/xz.jpg'
import io from 'socket.io-client'
import { mapState } from 'vuex'
export default {
  name: 'chat',
  created () {
    // 建立websocket和服务器的链接
    // io('地址', {参数})
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: { token: this.user.token }
    })
    this.socket.on('connect', () => {
      console.log('和服务器建立连接成功！')
      this.list.push({ msg: '你好', name: 'xz' }) // name:xz 表示小智说话
    })
    // data 中msg就是小智同学回复内容 timestmp小智回复内容的事件戳
    this.socket.on('message', (data) => {
      // this.list.push({ ...data, name: 'xz' })
      this.list.push({ name: 'xz', msg: data.msg })
      this.scroll()
    })
  },

  beforeDestroy () {
    this.socket.close()
  },
  computed: {
    ...mapState(['photo', 'user'])
  },
  data () {
    return {
      value: '',
      loading: false,
      XZImg, // 头像
      list: [], // 存储聊天记录
      socket: null
    }
  },
  methods: {
    async  send () {
      if (!this.value) return false
      this.loading = true // 打开加载状态
      await this.$sleep() // 强制等待
      // 3. 发信息
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      // 聊天记录
      this.list.push({ name: 'self', msg: this.value })
      this.value = ''
      this.loading = false
      this.scroll()
    },
    scroll () {
      // 视图更新后执行
      this.$nextTick(() => {
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight // 滚到底部
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
}
</style>
