<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" @click-right="saveUserInfo" title="编辑资料" right-text="保存"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="user.name" @click="showNickName=true" />
      <van-cell is-link title="性别" :value="user.gender===0?'男':'女'" @click="showGender=true" />
      <van-cell is-link title="生日" :value="user.birthday" @click="showDate" />
    </van-cell-group>
    <!-- 选择头像弹层 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <van-cell is-link title="本地上传" @click="openChangeFile"></van-cell>
      <van-cell is-link title="照相机"></van-cell>
    </van-popup>
    <!-- 昵称弹层 -->
    <van-popup v-model="showNickName" style="width:80%" :close-on-click-overlay="false" round >
      <!-- <van-field type="textarea" rows="4" v-model="user.name"></van-field> -->
      <van-cell-group>
        <van-field input-align="center" error-message-align="center" v-model="user.name" placeholder="请输入昵称" type="textarea" rows="2" :error-message="nameMsg"/>
      </van-cell-group>
      <van-button type="info" size="100%" block @click="btn">确定</van-button>
    </van-popup>
    <!-- 性别选择弹层 -->
    <van-action-sheet :actions="actions" v-model="showGender" cancel-text="取消" @select="onSelect"></van-action-sheet>
    <!-- 时间弹层 -->
    <van-popup v-model="showBirthday" position="bottom" round>
      <!-- 选择出生日期 出生日期小于现在时间 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <!-- 文件上传控件  -->
    <input type="file" name="" ref="myFile" style="display:none" @change="upload()">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updateImg, saveUserInfo } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'profile',
  data () {
    return {
      minDate: new Date(1900, 1, 1), // 最小时间
      maxDate: new Date(), // 最大时间
      currentDate: new Date(),
      showBirthday: false, // 是否显示生日弹层
      showPhoto: false, // 是否显示选择头像弹层
      showNickName: false, // 是否显示昵称弹层
      showGender: false, // 是否显示选择性别弹层
      user: {
        name: '', // 用户昵称
        gender: 0, // 0男 1女
        birthday: '' // 生日
      },
      actions: [{ name: '男' }, { name: '女' }],
      nameMsg: ''// 控制显示错误信息
    }
  },
  methods: {
    ...mapMutations(['updatePhoto']), // 引入公共的mutations方法
    // 选择性别触发
    onSelect (item) {
      // console.log(item)
      this.user.gender = item.name === '男' ? 0 : 1
      this.showGender = false // 关闭当前弹层
    },
    // 设置昵称
    btn () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        this.nameMsg = '昵称长度不符合规定'
        return false
      }
      this.nameMsg = '' // 清空提示内容
      this.showNickName = false // 关闭弹层
    },
    // 生日弹层
    showDate () {
      // 将字符串转化成日期类型
      this.currentDate = new Date(this.user.birthday)
      this.showBirthday = true
    },
    confirmDate (data) {
      this.user.birthday = dayjs(data).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    // 获取用户资料
    async getUserProfile () {
      let data = await getUserProfile()
      // 将数据赋值给user
      this.updatePhoto({ photo: data.photo })
      this.user = data
    },
    // 点击上传图片
    openChangeFile () {
      // 上传本地文件
      // 触发文件上传组件的点击事件
      this.$refs.myFile.click()
    },
    // 选择图片后触发
    async upload () {
      // console.log(this.$refs.myFile.files[0])
      let data = new FormData()
      data.append('photo', this.$refs.myFile.files[0])
      let result = await updateImg(data)
      // console.log(result)
      this.user.photo = result.photo
      this.showPhoto = false
      // 当头像上传成功后 把上传成功的头像地址设置给state
      this.updatePhoto({ photo: result.photo })
    },
    // 保存用户信息 调用保存接口
    async saveUserInfo () {
      try {
        await saveUserInfo({ ...this.user, photo: null })
        this.$notify({ type: 'success', message: '保存成功' })
      } catch (e) {
        this.$notify({ type: 'danger', message: '保存失败' })
      }
    }
  },
  created () {
    // 初始化用户资料
    this.getUserProfile()
  }
}
</script>

<style lang="less" scoped>
</style>
