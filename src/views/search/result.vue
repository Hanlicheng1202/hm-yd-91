<template>
  <div class="container">
   <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />

      <van-list  v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <van-cell :to="`/articles?articleId=${article.art_id.toString()}`" v-for="article in articles" :key="article.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{article.title}}</h3>
              <div class="img_box" v-if="article.cover.type===3">
                <van-image class="w33" fit="cover" :src="article.cover[0]" />
                <van-image class="w33" fit="cover" :src="article.cover[1]" />
                <van-image class="w33" fit="cover" :src="article.cover[2]" />
              </div>
              <div class="img_box" v-if="article.cover.type===1">
                <van-image class="w100" fit="cover" :src="article.cover[0]" />
              </div>
              <div class="info_box">
                <span>{{article.aut_name}}</span>
                <span>{{article.comm_count}}评论</span>
                <span>{{article.pubdate | relTime}}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import { searchArticles } from '@/api/article'

export default {
  name: 'result',
  data () {
    return {
      upLoading: false,
      finished: false,
      articles: [],
      page: {
        page: 1,
        per_page: 10
      }
    }
  },
  methods: {
    async onLoad () {
      let { q } = this.$route.query
      let data = await searchArticles({ q, ...this.page })
      this.articles.push(...data.results)
      this.upLoading = false
      if (data.results.length) {
        this.page.page++
      } else {
        this.finished = true
      }
    }

  }

}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
