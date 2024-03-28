import { favorCollection, likeCollection } from '../../database/index'
import { menuCollection } from '../../database/index'
Component({
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: -1
    },
    menuList: {
      type: Array,
      value: []
    }
  },
  methods: {
    onSongItemTap() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: '/pages/music-player/music-player?id=' + id,
      })
    },
    onMoreTap() {
      wx.showActionSheet({
        itemList: ['收藏', '喜欢', '添加到歌单'],
        success: ({ tapIndex }) => {
          this.handleOperationResult(tapIndex)
        }
      })
    },
    async handleOperationResult(tapIndex) {

      let res = ''
      let msg = ''
      switch (tapIndex) {
        case 0:
          // 收藏 
          res = await favorCollection.add(this.properties.itemData)
          msg = '收藏'
          wx.showToast({
            title: '收藏成功',
            icon: 'success'
          })
          break;
        case 1:
          // 喜欢
          res = await likeCollection.add(this.properties.itemData)
          msg = '喜欢'
          break
        case 2:
          const itemList = this.properties.menuList.map(item => item.name)
          wx.showActionSheet({
            itemList: itemList,
            success: ({ tapIndex }) => {

              this.handleMenuIndex(tapIndex)
            }
          })
          return
      }
      if (res) {
        wx.showToast({
          title: msg + '成功',
          icon: 'success'
        })
      } else {
        wx.showToast({
          title: msg + '失败',
          icon: 'error'
        })
      }
    },
    async handleMenuIndex(index) {
      const menuItem = this.properties.menuList[index]
      const cmd = wx.cloud.database().command
      const res = await menuCollection.update(menuItem._id, {
        songList: cmd.push(this.properties.itemData)
      })
      if (res) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
      }
    }
  }
})
