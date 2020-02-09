<template>
  <div class="container">
    <van-tabs v-model="activeIndex" swipeable @change="changeTab">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id">
        <!-- 文章列表组件  每一个频道都对应一个文章列表组件-->
        <!-- 给文章组件列表传值 -->
        <article-list @showMoreAction="openMoreAction" :channel_id="channel.id"></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav" @click="showChannelEdit=true" />
    </span>
    <!-- 反馈弹层 -->
     <van-popup :style="{ width: '80%' }" v-model="showMoreAction">
      <more-action @dislike="dislike" @report="report"></more-action>
    </van-popup>
     <!-- 频道编辑组件 -->
    <van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
      <channel-edit
        :activeIndex="activeIndex"
        @delChannel="delChannel"
        @addChannel ="addChannel"
        :channels="channels"
        @selectChannel="selectChannel"
      ></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import ArticleList from './components/article-list'
import { getMyChannels, delChannel, addChannel } from '@/api/channel'
import { disLikeArticle, reportArticle } from '@/api/article'
import ChannelEdit from './components/channel-edit'
import MoreAction from './components/more-actian'
import eventBus from '@/utils/eventBus'
export default {
  name: 'home', // devtools查看组件时  可以看到 对应的name名称
  data () {
    return {
      activeIndex: 0,
      // 声明接收频道的数据
      channels: [],
      showChannelEdit: false, // 控制频道组件显示隐藏
      showMoreAction: false, // 控制反馈组件显示隐藏
      articleId: null // 接收文章id
    }
  },
  components: {
    ArticleList,
    ChannelEdit,
    MoreAction
  },
  created () {
    this.getChannels()
  },
  methods: {
    // 切换tab页时触发
    changeTab () {
      // 通知所有的article-list实例 切换tab了 把切换的tab传递过去 article-list获取传递过去的tab
      // 判断组件是否有滚动 如果有滚动 滚动到对应的位置
      // 切换tab 触发一个公共事件
      eventBus.$emit('changeTab', this.channels[this.activeIndex].id)
    },
    // 获取我的频道
    async getChannels () {
      const res = await getMyChannels()
      // console.log(res)

      //  将获取的数据赋值给声明好的channels
      this.channels = res.channels
    },
    // 切换到对应频道 关闭弹层
    selectChannel (id) {
      let index = this.channels.findIndex(item => item.id === id) // 获取切换频道的索引
      this.activeIndex = index // 切换激活标签
      this.showChannelEdit = false // 关闭弹层
      // console.log(index)
    },
    // 删除频道
    async delChannel (id) {
      try {
        await delChannel(id)
        // 获取要删除的那个频道的索引
        let index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          // 如果删除的频道在当前激活频道之前或者就是当前激活频道，则需要把我们的激活索引往前移动一位
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          this.channels.splice(index, 1) // 移除当前频道
        }
      } catch (e) {
        this.$notify({ type: 'danger', message: '删除失败' })
      }
    },
    // 添加频道
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)
    },
    // 反馈弹层的显示隐藏
    openMoreAction (id) {
      this.showMoreAction = true
      // 接收文章id
      this.articleId = id
      // console.log(this.articleId)
    },
    // 不喜欢文章
    async dislike () {
      try {
        if (this.articleId) {
          await disLikeArticle({
            target: this.articleId
          })
          this.$notify({ type: 'success', message: '操作成功' })
          eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
          // 关闭弹层
          this.showMoreAction = false
        }
      } catch (e) {
        this.$notify({ type: 'danger', message: '操作失败' })
      }
    },
    // 举报文章
    async report (type) {
      try {
        await reportArticle({ target: this.articleId, type })
        this.$notify({ type: 'success', message: '操作成功' })
        // 删除
        eventBus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        this.showMoreAction = false
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>
