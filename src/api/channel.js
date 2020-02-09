// 专门处理频道的请求
import request from '@/utils/request'
import store from '@/store'
// 定义两个key 分别存储游客 和登录用户数据
const CACHE_CHANNEL_T = 'hm-toutiao-yidong-t' // 游客缓存的key
const CACHE_CHANNEL_U = 'hm-toutiao-yidong-U' // 登录用户的key
// 获取我的频道数据
export function getMyChannels () {
  return new Promise(async function (resolve, reject) {
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 从缓存中读取数据
    let str = localStorage.getItem(key) // 得到缓存结果
    if (str) {
      // 如果str存在表示缓存中有数据
      resolve({ channels: JSON.parse(str) })
    } else {
      // 没有数据
      // 从线上请求数据
      const data = await request({ url: 'app/v1_0/user/channels' })
      // 将请求的数据写入缓存
      localStorage.setItem(key, JSON.stringify(data.channels))
      resolve(data) // 将线上请求的数据释放给promise
    }
  })
}

// 获取所有频道
export function getAllChannels () {
  return request({
    url: 'app/v1_0/channels'
  })
}
// 删除我的频道
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 首先判断是登录后删除还是游客删除
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    // 得到缓存中的数据
    let channels = JSON.parse(localStorage.getItem(key))
    // 获取对应频道的索引
    let index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      // 删除数据
      channels.splice(index, 1) // 直接删除原数组中的数据
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve()
    } else {
      reject(new Error('找不到对应的频道'))
    }
  })
}

// 添加频道
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    // 首先要判断是游客还是用户
    let key = store.state.user.token ? CACHE_CHANNEL_U : CACHE_CHANNEL_T
    let channels = JSON.parse(localStorage.getItem(key))
    channels.push(channel) // 将频道添加到末尾
    localStorage.setItem(key, JSON.stringify(channels))
    resolve()
  })
}
