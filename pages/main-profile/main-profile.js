import { menuCollection } from '../../database/index'
import menuStore from '../../store/menuStore'
Page({
  data: {
    userInfo: {},
    isLogin: false,
    isShowDialog: false,
    menuName: '',
    menuList: [],
    tabs: [
      {
        name: '收藏',
        type: 'favor'
      },
      {
        name: '喜欢',
        type: 'like'
      },
      {
        name: '历史',
        type: 'history'
      }
    ]
  },
  onLoad() {
    const openId = wx.getStorageSync('openId')
    const userInfo = wx.getStorageSync('userInfo')
    if (openId) this.setData({ isLogin: !!openId, userInfo })
    menuStore.onState("menuList", this.hanldeMenuList)
  },
  onUnload() {
    menuStore.offState("menuList", this.hanldeMenuList)
  },
  async login() {
    if (this.data.isLogin) return
    const profile = await wx.getUserProfile({
      desc: '获取昵称和头像',
    })
    const loginRes = await wx.cloud.callFunction({
      name: 'music-login'
    })
    const openId = loginRes.result.OPENID
    const userInfo = { avatar: profile.userInfo.avatarUrl, nickName: profile.userInfo.nickName }
    this.setData({ isLogin: true, userInfo })
    wx.setStorageSync('openId', openId)
    wx.setStorageSync('userInfo', userInfo)
  },

  onTabItemClick(event) {
    const current = this.data.tabs[event.currentTarget.dataset.index]
    wx.navigateTo({
      url: '/pages/detail-song/detail-song?type=profile&tabname=' + current.type,
    })
  },
  onAddTap() {
    this.setData({ isShowDialog: true })
  },
  onCloseDialog() {
    this.setData({ isShowDialog: false })
  },
  async onConfirmDialog() {
    const menuName = this.data.menuName
    if (menuName.length === 0) return
    const res = await menuCollection.add({
      name: menuName,
      songList: []
    })
    if (res) {
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      menuStore.dispatch('fetchMenuListAction')
    }
  },


  // 数据共享的代码
  hanldeMenuList(value) {
    this.setData({ menuList: value })
  }
})