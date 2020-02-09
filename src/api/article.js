// 获取文章数据
import request from '@/utils/request'
export function getArticles (params) {
  return request({
    url: 'app/v1_1/articles',
    params: { with_top: 1, ...params }
  })
}
// 不喜欢文章
export function disLikeArticle (data) {
  return request({
    url: 'app/v1_0/article/dislikes',
    method: 'post',
    data
  })
}
// 举报文章
export function reportArticle (data) {
  return request({
    url: 'app/v1_0/article/reports',
    method: 'post',
    data
  })
}
// 联想搜索
export function suggestion (params) {
  return request({
    url: 'app/v1_0/suggestion',
    params
  })
}
// 搜索文章
export function searchArticles (params) {
  return request({
    url: 'app/v1_0/search',
    params
  })
}
// 获取文章详情
export function getArticleInfo (id) {
  return request({
    url: `app/v1_0/articles/${id}`
  })
}
// 获取评论
export function getComments (params) {
  return request({
    url: 'app/v1_0/comments', // 请求地址
    // query 参数 放置在params
    // body 参数 放在data
    params

  })
}
// 评论 或回复评论
export function commentOrReply (data) {
  return request({
    url: 'app/v1_0/comments', // 请求地址
    method: 'post', // 请求类型不同
    data
  })
}
