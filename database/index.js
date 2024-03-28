class HYCollection {
  constructor(collectionName) {
    const db = wx.cloud.database()
    this.collection = db.collection(collectionName)
  }

  add(data) {
    return this.collection.add({
      data
    })
  }

  remove(condition, isDoc = true) {
    if (isDoc) {
      return this.collection.doc(condition).remove()
    } else {
      return this.collection.where(condition).remove()
    }
  }

  update(condition, data, isDoc = true) {
    if (isDoc) {
      return this.collection.doc(condition).update({
        data
      })
    } else {
      return this.collection.where(condition).update({
        data
      })
    }
  }

  query(condition = {}, isDoc = false, offset = 0, size = 20) {
    if (isDoc) {
      return this.collection.doc(condition).get()
    } else {
      return this.collection.where(condition).skip(offset).limit(size).get()
    }
  }

}

export const favorCollection = new HYCollection('c_favor')
export const likeCollection = new HYCollection('c_like')
export const historyCollection = new HYCollection('c_history')
export const menuCollection = new HYCollection('c_menu')