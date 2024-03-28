// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import menuStore from '../../store/menuStore'
import { getPlaylistDetail } from "../../services/music"

import { favorCollection, likeCollection, historyCollection } from '../../database/index'

Page({
  data: {
    type: "ranking",
    key: "newRanking",
    id: "",
    songInfo: {},
    menuList: []
  },
  onLoad(options) {
    // 1.确定获取数据的类型
    // type: ranking -> 榜单数据
    // type: recommend -> 推荐数据
    const type = options.type
    // this.data.type = type
    this.setData({ type })

    // 获取store中榜单数据
    if (type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    } else if (type === "recommend") {
      recommendStore.onState("recommendSongInfo", this.handleRanking)
    } else if (type === "menu") {
      const id = options.id
      this.data.id = id
      this.fetchMenuSongInfo()
    } else if (type === 'profile') {
      const tabname = options.tabname
      this.handleProfileSongInfo(tabname)
    }

    // 获取歌单列表
    menuStore.onState("menuList", this.hanldeMenuList)
  },

  async handleProfileSongInfo(tabname) {
    let collection
    let songInfoName
    switch (tabname) {
      case 'like':
        collection = likeCollection
        songInfoName = '我的喜欢'
        break;
      case 'favor':
        collection = favorCollection
        songInfoName = '我的收藏'
        break;
      case 'history':
        collection = historyCollection
        songInfoName = '播放历史'
    }
    const res = await collection.query({ _openid: wx.getStorageSync('openId') })
    console.log(res);
    this.setData({
      songInfo: {
        name: songInfoName,
        tracks: res.data
      }
    })
  },

  async fetchMenuSongInfo() {
    const res = await getPlaylistDetail(this.data.id)
    this.setData({ songInfo: res.playlist })
  },

  handleRanking(value) {
    // if (this.data.type === "recommend") {
    //   value.name = "推荐歌曲"
    // }
    this.setData({ songInfo: value })
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  hanldeMenuList(value) {
    this.setData({ menuList: value })
  },


  onUnload() {
    if (this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    } else if (this.data.type === "recommend") {
      recommendStore.offState("recommendSongInfo", this.handleRanking)
    }
    menuStore.offState("menuList", this.hanldeMenuList)
  }
})