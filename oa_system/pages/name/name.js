// pages/name/name.js

var Api = require('../../utils/api.js')

Page({
  data: {
    newName: '',
    originName: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      token: wx.getStorageSync('token'),
      originName: options.name,
      companyId: options.id,
    })
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
  bindInputOnchange: function (event) {
    this.setData({
      newName: event.detail.value
    })
  },
  bindChangeNameBtn: function () {
    var that = this
    var newName = this.data.newName
    wx.request({
      url: Api.changName,
      data: {
        token: this.data.token,
        name: this.data.newName,
        id: this.data.companyId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.Code == 200) {
          that.setData({
            originName: newName
          })
          var company = wx.getStorageSync('company')
          console.log(company)
          console.log(newName)
          company.Name = newName
          try {
            wx.setStorage({
              key: 'company',
              data: company,
              success: function (res) {
                //success
              },
              fail: function (res) {
                wx.showToast({
                  title: '系统错误',
                  icon: 'fail',
                  duration: 1000
                })
              }
            })
          } catch (e) {
            return
          }

          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 10000
          })
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })
        }else{
          wx.showToast({
            title: '修改失败，请重试',
            icon: 'fail',
            duration: 10000
          })
        }
      }
    })
  }
})