import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  // 放置公共数据
  state: {
    // 初始化时直接将用户信息给公共状态
    user: auth.getUser(), // 从缓存中获取
    photo: null // 用户头像
  },
  mutations: {
    updateUser (state, payload) {
      state.user = payload.user // 跟新数据
      auth.setUser(payload.user) // 将数据同步到本地存储
    },
    // 清空用户信息
    clearUser (state, payload) {
      state.user = {}
      auth.delUser() // 在缓存中删除用户信息
    },
    // 更新用户头像
    updatePhoto (state, payload) {
      state.photo = payload.photo // 将载荷里的数据赋值给state
    }

  },
  actions: {
  },
  modules: {
  }
})
