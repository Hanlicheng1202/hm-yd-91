// 路由拦截登录
// 导航守卫 当路由放生变化的时候就会触发导航守卫
// 引入路由实例
// 确定要拦截的页面 /user  个人中心  /user/chat    /user/profile
import router from '@/router'
import store from '@/store'
router.beforeEach(function (to, from, next) {
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 拦截/user /user/chat /user/profile  判断是否有token  没有token 去登录
    // 定义一个变量 保存要去访问的地址
    // 携带要去的地址到登录页 => 登录成功之后  有了权限 再回到刚才没有权限去的地址
    let toPath = {
      path: '/login',
      query: {
        redirectUrl: to.fullpath
      }
    }
    next(toPath)
  } else {
    next()
  }
})
export default router
