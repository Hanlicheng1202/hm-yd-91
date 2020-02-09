<template>
  <!-- 这里注意 这个div设置了滚动条 目的是 给后面做 阅读记忆 留下伏笔 -->
  <!-- 阅读记忆 => 看文章看到一半 滑到中部 去了别的页面 当你回来时 文章还在你看的位置 -->
  <div class="scroll-wrapper" @scroll="remeber" ref="myScroll">
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell v-for="article in articles" :key="article.art_id.toString()" :to="`/articles?articleId=${article.art_id.toString()}`">
          <div class="article_item">
            <h3 class="van-ellipsis">{{article.title}}</h3>
            <!-- 三图模式 -->
            <div class="img_box" v-if="article.cover.type===3">
               <van-image class="w100" fit="cover" :src="article.cover.images[0] " lazy-load/>
            <van-image class="w100" fit="cover" :src="article.cover.images[1] " lazy-load/>
               <van-image class="w100" fit="cover" :src="article.cover.images[2] " lazy-load/>
            </div>
            <!-- 单图模式 -->
            <div class="img_box" v-if="article.cover.type===1">
             <van-image class="w100" fit="cover" :src="article.cover.images[0]" lazy-load/>
            </div>
            <div class="info_box">
              <span>{{article.aut_name}}</span>
              <span>{{article.comm_count}}评论</span>
              <span>{{article.pubdate|relTime}}</span>
              <!-- 根据用户是否登录 token控制是否显示close -->
              <span class="close" @click.stop="$emit('showMoreAction',article.art_id.toString())" v-if="user.token">
                <van-icon name="cross" ></van-icon>
              </span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getArticles } from '@/api/article'
import eventBus from '@/utils/eventBus'
export default {
  computed: {
    ...mapState(['user'])
  },
  // 接收父组件的数据
  props: {
    // 接收父组件传递的频道id
    channel_id: {

      type: Number,
      required: true,
      default: null
    }
  },
  data () {
    return {
      // 是否加载数据
      upLoading: false,
      // 是否加载完成
      finished: false,
      articles: [],
      // 是否刷新
      downLoading: false,
      refreshSuccessText: '刷新成功',
      // 存放时间戳
      timestamp: null,
      scrollTop: 0 // 记录当前列表所滚动的位置
    }
  },
  created () {
    // 开启监听
    eventBus.$on('delArticle', (articleId, channelId) => {
      console.log(articleId, channelId)

      if (this.channel_id === channelId) {
        // 这个条件表示 该列表就是当前激活的列表
        let index = this.articles.findIndex(item => item.art_id.toString() === articleId) // 查找对应的文章
        // 如果index大于 -1 表示找到了 就要删除
        if (index > -1) {
          this.articles.splice(index, 1) // 删除文章
        }
      }
    })
    // 监听当前tab切换事件
    eventBus.$on('changeTab', id => {
      if (id === this.channel_id) {
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
            this.$refs.myScroll.scrollTop = this.scrollTop
          }
        })
      }
    })
  },

  methods: {
    // 上滑加载
    async onLoad () {
      await this.$sleep()
      // 加载方法
      //   setTimeout(() => {
      //     console.log('加载了')
      //     if (this.articles.length === 50) {
      //       // 停止加载(停止追加数据)
      //       this.finished = true
      //     } else {
      //       let arr = Array.from(
      //         Array(10),
      //         (value, index) => index + this.articles.length + 1
      //       )
      //       // 把生成的数据追加到articles数组末尾
      //       this.articles.push(...arr)
      //       // 停止加载
      //       this.upLoading = false
      //     }
      //   }, 1000)
      const res = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() })
      //   将数据追加到末尾
      // console.log(this.channel_id)

      //   console.log(res.results)

      this.articles.push(...res.results)
      // 停止加载
      this.upLoading = false
      // console.log(res.pre_timestamp)
      if (res.pre_timestamp) {
        //    如果有 更新时间戳
        this.timestamp = res.pre_timestamp
      } else {
        // 没有数据了 停止加载
        this.finished = true
      }
    },

    // 下拉刷新
    async onRefresh () {
      await this.$sleep()
      // 触发刷新
      console.log('刷新了')
      //   setTimeout(() => {
      //     let arr = Array.from(
      //       Array(10),
      //       (value, index) => '刷新数据' + (index + 1)
      //     )
      //     // 将数据添加到头部
      //     this.articles.unshift(...arr)
      //     // 停止刷新
      //     this.downLoading = false
      //     this.refreshSuccessText = `更新了${arr.length}条数据`
      //   }, 1000)
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() })
      // 停止刷新
      this.downLoading = false
      // 判断有没有新数据
      if (data.results.length) {
        // 长度大于0 表示有数据
        // 重新给articles赋值
        this.articles = data.results
        // 需要重新加载
        this.finished = false
        this.timestamp = data.pre_timestamp
        this.refreshSuccessText = `更新了${data.results.length}条数据`
      } else {
        // 没有数据  不需要刷新
        this.refreshSuccessText = '已经是最新数据'
      }
    },
    remeber (e) {
      // 记录当前滚动的位置
      this.scrollTop = e.target.scrollTop
    }

  },
  // 唤醒函数 当组件被keep-alive包裹
  activated () {
    // 当scrollTop 不为0 且 this.$refs.myScroll 存在时
    if (this.scrollTop && this.$refs.myScroll) {
      // 将原来的位置赋值给div
      this.$refs.myScroll.scrollTop = this.scrollTop
    }
  }

}

</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
