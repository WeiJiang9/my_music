import { menuCollection } from '../../database/index'
import menuStore from '../../store/menuStore'
Component({
  properties: {
    menuItem: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onMenuItemTap() {
      wx.navigateTo({
        url: '/pages/detail-song/detail-song',
      })
    },
    async onDeleteMenuItem() {
      // 获取歌单的_id
      const res = await menuCollection.remove(this.properties.menuItem._id)
      if (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        menuStore.dispatch('fetchMenuListAction')
      }
    }
  }
})