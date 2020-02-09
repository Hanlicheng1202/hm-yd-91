// 引入封装好的axios实例模块
import request from '@/utils/request'
export function login (data) {
  return request({
    url: 'app/v1_0/authorizations',
    method: 'post',
    data
  })
}
// 获取个人信息
export function getUserInfo () {
  return request({
    url: 'app/v1_0/user'
  })
}
// 关注用户
export function followUser (data) {
  return request({
    url: 'app/v1_0/user/followings',
    method: 'post',
    data
  })
}
// 取消关注
export function unfollowUser (target) {
  return request({
    url: `app/v1_0/user/followings/${target}`,
    method: 'delete'

  })
}
// 获取用户个人资料
export function getUserProfile () {
  return request({
    url: 'app/v1_0/user/profile'

  })
}
// 编辑用户头像
export function updateImg (data) {
  return request({
    url: 'app/v1_0/user/photo',
    method: 'patch',
    data
  })
}
// 保存用户信息
export function saveUserInfo (data) {
  return request({
    url: 'app/v1_0/user/profile',
    method: 'patch',
    data
  })
}
