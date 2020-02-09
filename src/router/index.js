import Vue from 'vue'
import VueRouter from 'vue-router'
const Layout = () => import('@/views/layout') // 布局组件
const Home = () => import('@/views/home') // 首页
const Question = () => import('@/views/question') // 问答
const Videos = () => import('@/views/videos') // 视频
const User = () => import('@/views/user') // 个人中心
const Profile = () => import('@/views/user/profile') // 编辑资料
const Chat = () => import('@/views/user/chat') // 小智
const Login = () => import('@/views/login') // 登录
const Articles = () => import('@/views/articles') // 文章详情
const Search = () => import('@/views/search') // 搜索
const Result = () => import('@/views/search/result') // 搜索结果
Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    name: 'layout',
    component: Layout, // 一级路由

    // 由于一级路由下存在二级路由 并且path相同  需要将meta放到二级路由并且path相同的路由下
    children: [
      {
        path: '/',
        name: 'home',
        component: Home, // 二级路由 首页
        meta: {
          isAlive: true // 指定哪个组件需要缓存
        }
      },
      {
        path: '/question',
        name: 'question',
        component: Question // 二级路由 问答
      },
      {
        path: '/videos',
        name: 'videos',
        component: Videos // 二级路由 视频
      },
      {
        path: '/user',
        name: 'user',
        component: User // 二级路由 个人中心
      }
    ]

  },
  {
    path: '/user/profile',
    name: 'profile',
    component: Profile // 一级路由  编辑资料
  },
  {
    path: '/user/chat',
    name: 'chat',
    component: Chat // 一级路由  小智
  },
  {
    path: '/login',
    name: 'login',
    component: Login // 一级路由  登录
  },
  {
    path: '/articles',
    name: 'my-article',
    component: Articles // 一级路由  文章详情
  },
  {
    path: '/search',
    name: 'search',
    component: Search // 一级路由  搜索
  },
  {
    path: '/search/result',
    name: 'result',
    component: Result // 一级路由  搜索结果
  }
]

const router = new VueRouter({
  routes
})

export default router
