<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="comment in comments"
        :key="comment.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="comment.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{ comment.aut_name }}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{ comment.like_count }}</span>
            </span>
          </p>
          <p>{{ comment.content }}</p>
          <p>
            <span class="time">{{ comment.pubdate | relTime }}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id)">{{ comment.reply_count }} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit()">提交</span>
      </van-field>
    </div>
    <!-- 回复列表组件 -->
    <van-action-sheet
      @closed="reply.commentId = null"
      v-model="showReply"
      class="reply_dailog"
      title="回复评论"
      :round="false"
    >
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="getReply()"
        :immediate-check="false"
      >
        <div
          class="item van-hairline--bottom van-hairline--top"
          v-for="reply in reply.list"
          :key="reply.com_id.toString()"
        >
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <p>
              <span class="name">{{reply.aut_name}}</span>
            </p>
            <p>{{reply.content}}</p>
            <p>
              <span class="time">{{reply.pubdate|relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/article'
// commentOrReply
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      comments: [], // 存放评论列表数据
      offset: null, // 分页依据  如果为空表示从第一页开始
      showReply: false, // 控制回复列表显示隐藏
      // reply对象存放 回复列表相关数据
      reply: {
        // 上拉加载中
        loading: false,
        // 全部加载完毕
        finished: false,
        // 偏移量
        offset: null,
        // 回复列表
        list: [],
        commentId: null // 用来存放当前点击的评的id
      }
    }
  },

  methods: {
    // 提交品论的方法
    async submit () {
      this.submiting = true // 控制用户单位时间内评论的次数
      await this.$sleep() // 强制等待500ms
      // 一种是对文章进行评论  一种是对评论进行评论
      try {
        if (!this.value) {
          // 评论内容为空就放回
          this.submiting = false
          return false
        }
        // 通过reply.commentId是否存在判断是文章 还是评论
        // reply有值则是对评论就行评论 null 就是对文章就行评论
        let data = await commentOrReply({
          target: this.reply.commentId
            ? this.reply.commentId.toString()
            : this.$route.query.articleId, // 要么是文章id 要么是回复id
          content: this.value, // 评论内容
          art_id: this.reply.commentId ? this.$route.query.articleId : null // 如果对文章进行评论不需要传 值为null
        })
        if (this.reply.commentId) {
          // 存在 表示对评论进行评论
          this.reply.list.unshift(data.new_obj)
          // 评论后应该找到该评论并把该评论的回复次数+1
          let comment = this.comments.find(
            item => item.com_id.toString() === this.reply.commentId.toString()
          )
          comment && comment.reply_count++
        } else {
          // 不存在 表示对文章进行评论
          this.comments.unshift(data.new_obj)
        }
        // 清空输入框
        this.value = null
      } catch (e) {
        this.$notify({ type: 'danger', message: '评论数据' })
      }
      // 最后关闭评论submiting
      this.submiting = false
    },

    // 打开回复列表评论
    openReply (commentId) {
      this.showReply = true
      this.reply.commentId = commentId // 存储当前点击的那条评论的id
      this.reply.list = []
      this.reply.offset = null
      this.reply.finished = false // 设置为原始状态
      this.reply.loading = true // 主动打开加载状态
      this.getReply() // 开始调用第一页的数据
    },
    // 获取评论回复数据
    async getReply () {
      let data = await getComments({
        type: 'c',
        offset: this.reply.offset,
        source: this.reply.commentId.toString() // 获取文章的评论的id
      })
      console.log(data) // 拿到的data只是第一页的数据
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭加载状态
      this.reply.finished = data.end_id === data.last_id
      if (!this.reply.finished) {
        this.reply.offset = data.last_id
      }
    },
    async onLoad () {
      let data = await getComments({
        type: 'a', // 获取类型
        offset: this.offset, // 偏移量
        source: this.$route.query.articleId // 获取文章id给source
      })
      // console.log(data)
      this.comments.push(...data.results)
      this.loading = false // 关闭上拉加载状态
      this.finished = data.last_id === data.end_id
      if (!this.finished) {
        this.offset = data.last_id // 将last_id设置成下一页的请求依据
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
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
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
// 回复列表样式
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>
