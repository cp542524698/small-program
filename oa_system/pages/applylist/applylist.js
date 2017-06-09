// pages/applylist/applylist.js
var app = getApp()
console.log(app.appName)
var Api = require('../../utils/api.js');

Page({
  data: {
    list: []
  },
  onLoad: function (options) {

    this.setData({
      id: options.conpanyid,
      token: wx.getStorageSync('token')
    })

    this.getApplyList()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  getApplyList: function () {
    wx.request({
      url: Api.applylist,
      data: {
        token: this.data.token,
        companyId: this.data.id,
      },
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: (res) => {
        console.log(res)
        if (res.data.Code == 200) {
          this.setData({
            list: res.data.data
          })
        }
      }
    })
  },

  handleRefuse: function (event) {
    var id = event.currentTarget.dataset.id;
    console.log("id:", id)
    this.handleApply(id, 1, () => {
      this.getApplyList()
    })
  },

  handleAccept: function (event) {
    var id = event.currentTarget.dataset.id;
    this.handleApply(id, 0, () => {
      this.getApplyList()
    })
  },

  handleApply: function (id, validation, cb) {
    wx.request({
      url: Api.verifyApply,
      data: {
        token: this.data.token,
        userid: id,
        companyid: this.data.companyId,
        validation: validation,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // success
        console.log(res)
        if (res.data.code == 200) {
          typeof cb === 'function' && cb()
        }
      }
    })
  }

})