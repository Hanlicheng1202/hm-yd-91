// 处理用户信息
const userToken = 'hm-toutiao-yidong-token' // 定义一个key专门存储用户信息
// 存储用户信息
export function setUser (user) {
  localStorage.setItem(userToken, JSON.stringify(user))
}
// 获取用户信息
export function getUser () {
  // 返回一个对象
  return JSON.parse(localStorage.getItem(userToken) || '{}')
}
// 删除用户信息
export function delUser () {
  localStorage.removeItem(userToken)
}
