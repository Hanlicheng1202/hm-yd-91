<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    </div>
    <!-- 将所有的一级路由组件进行缓存 -->
    <!-- 通过$route.meta.isAlive 判断组件是否需要缓存
     实现只有layout组件缓存 其他一级组件不缓存
    -->
    <keep-alive >
    <router-view v-if="$route.meta.isAlive"/>
    </keep-alive>
     <router-view v-if="!$route.meta.isAlive"/>
  </div>
</template>

<style lang="less">

</style>
