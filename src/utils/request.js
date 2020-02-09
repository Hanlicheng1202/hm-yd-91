import axios from 'axios'
import JSONBIG from 'json-bigint'
import store from '@/store'
import router from '@/router'
// 创建一个新的 axios实例
const instance = axios.create({
  // 配置基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 处理大数字
  transformResponse: [function (data) {
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      return data
    }
  }]
})
// 请求拦截器
instance.interceptors.request.use(function (config) {
  // 如果存在token 就注入到请求头中
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  // 返回配置信息
  return config
}, function (error) {
  // 直接返回错误的Promise对象
  return Promise.reject(error)
})
// 响应拦截器
instance.interceptors.response.use(function (response) {
  try {
    // 返回得到的响应数据
    return response.data.data
  } catch (e) {
    return response.data
  }
}, async function (error) {
  // 判断失效
  if (error.response && error.response.status === 401) {
    // 记录当前的地址 登录成功后跳到该地址
    let toPath = {
      path: '/login',
      query: { redirectUrl: router.currentRoute.fullpath }
    }
    // 如果token失效 判断是否有refresh_token
    if (store.state.user.refresh_token) {
      try {
        // 有refresh_token 发送请求刷新token  因为instance会再次进入请求拦截器 所以使用axios
        // 定义一个变量接收结果
        let result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          method: 'put',
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}`
          }
        })
        // 拿到新的token后 更新vuex的数据 同时也更新本地缓存数据
        store.commit('updateUser', {
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        // 把之前错误的请求再次发送出去
        return instance(error.config)
      } catch (error) {
        // refresh_token 无效 则 去登录页面  并清空所有的用户信息
        store.commit('clearUser')
        router.push(toPath)
      }
    } else {
      // 没有refresh_token 直接去登录
      router.push(toPath)
    }
  }
  return Promise.reject(error)
})
export default instance
