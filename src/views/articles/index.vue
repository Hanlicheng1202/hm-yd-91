<template>
   <div class='container'>
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button @click="follow()"  round size="small" type="info">{{article.is_followed ? '已关注' : '+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <van-button round size="small" class="active" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" plain icon="delete">不喜欢</van-button>
      </div>
       <!-- 评论组件 -->
      <comment></comment>
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api/article'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './comments/comment'
export default {
  name: 'my-article',
  data () {
    return {
      article: {} // 用来接收用户信息
    }
  },
  components: {
    Comment
  },
  methods: {
    // 获取文章详情
    async getArticleInfo () {
      // console.log(this.$route.query)
      const { articleId } = this.$route.query
      this.article = await getArticleInfo(articleId)
      // console.log(this.article)
    },
    // 关注
    async follow () {
      try {
        if (this.article.is_followed) {
          // 取消关注
          await unfollowUser(this.article.aut_id)
        } else {
          // 关注
          await followUser({ target: this.article.aut_id })
        }
        this.article.is_followed = !this.article.is_followed
        this.$notify({ type: 'success', message: this.article.is_followed ? '关注成功' : '取消关注成功' })
      } catch (e) {
        this.$notify({
          type: 'danger',
          message: '操作失败'
        })
      }
    }
  },
  created () {
    this.getArticleInfo()
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>
