<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onsearch"/>
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="onsearch(item)" v-for="(item,index) in suggestList" :key="index" icon="search">
       {{item}}
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(history,index) in historyList" :key="index" @click="toSearchResult(history)">
          <a class="word_btn">{{history}}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delHistory(index)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 定义一个key 用来存储数据
import { suggestion } from '@/api/article'
const key = 'hm-toutiao-yidong-history'
export default {
  name: 'search',
  data () {
    return {
      q: '', // 查询数据
      historyList: [], // 历史记录数据
      suggestList: []
      // timer: null
    }
  },
  watch: {
    q () {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (!this.q) {
          this.suggestList = []
          return
        }
        let data = await suggestion({ q: this.q })
        this.suggestList = data.options
      }, 300)
    }
  },
  created () {
    // 初始化 读取数据
    // this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
    // console.log(this.historyList)
  },
  methods: {
    // 删除对应的历史记录
    delHistory (index) {
      this.historyList.splice(index, 1) // 从historyList中删除对应index数据
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将删除后的数据重新写入缓存
    },

    // 清空历史记录
    clear () {
      this.historyList = []
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 回车或虚拟键盘搜索
    onsearch () {
      //  判断q是否为空
      if (!this.q) return // 为空没有必要继续执行
      // 不为空 将输入的数据加入到历史记录中  set对象自动去掉重复数据
      let obj = new Set(this.historyList)
      obj.add(this.q)
      this.historyList = Array.from(obj) // 将set对象转为数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 将数据更新 到缓存
      // 跳转到搜索结果页面
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    },
    // 点击历史记录跳到搜索结果
    toSearchResult (text) {
      // 放入历史记录
      let obj = new Set(this.historyList) // 生成一个set变量  set对象自动去重
      obj.add(text)
      this.historyList = Array.from(obj) // 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      this.$router.push({ path: '/search/result', query: { q: text } }) // 直接跳转到搜索结果界面
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
