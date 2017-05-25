// pages/self/self.js

var Api = require('../../utils/api.js')

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      token: wx.getStorageSync('token')
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  handleQuit: function() {
    wx.showModal({
      title: '警告',
      content: '退出之后将删除所有个人信息，您确定么？',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          this.quitCompany()
        }
      }
    })
  },

  quitCompany: function() {
    wx.request({
      url: Api.tofree + this.data.token,
      data: {},
      method: 'DELETE', 
      success: function(res){
        // success
        if(res.data.code == 200) {
          this.setStorageSync('userType', 'user')
          wx.redirectTo({
            url: '/pages/select/select'
          })
        }       
      }
    })
  }

})