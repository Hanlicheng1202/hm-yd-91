<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(channel,index) in channels" :key="channel.id">
          <span :class="{red:index===activeIndex}" class="f12" @click="$emit('selectChannel',channel.id)">{{channel.name}}</span>

          <template v-if="index!==0">
             <van-icon class="btn" name="cross" v-show="editing" @click="$emit('delChannel',channel.id)"></van-icon>
          </template>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon class="btn" name="plus" @click="$emit('addChannel',item)" v-show="editing"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  // 接收父组件传递的数据
  props: {
    channels: {
      required: true,
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number
    }
  },
  created () {
    this.getAllChannels()
  },
  data () {
    return {
      editing: false, // 是否开启编辑
      allChannels: [] // 所有频道

    }
  },
  methods: {
    async  getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  // 计算属性
  computed: {
    // 可选频道
    optionChannels () {
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>
