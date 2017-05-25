// pages/login/login.js

var util = require('../../utils/util.js');


Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.clearStorageSync()
    var userType = wx.getStorageSync('userType')
    wx.getStorage({
      key: 'token',
      success: function(res){
        switch(userType) {
          case 'manager': 
            wx.switchTab({ url: '/pages/workers/workers' })
            break;
          case 'staff': 
            if(options.info) {
              wx.redirectTo({ url: '/pages/scan/scan' })
              break; 
            }
            else {
              wx.redirectTo({ url: '/pages/self/self' })
              break;
            }
          case 'user' : 
            wx.redirectTo({ url: '/pages/select/select' })
            break;
          default: 
            wx.redirectTo({
              url: '/pages/select/select',
            })
        }
      },
      fail: function() {
        // 说明未登录
      }
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
  handleLoginBtn() {
    util.getToken((res) => {
      console.log(res)
      //用户拒绝授权
      if(res.errMsg == 'userDenyed') {
        wx.redirectTo({
          url: '/pages/unAuth/unAuth',
        })
      }
      //用户允许授权
      else {
        wx.setStorageSync('userType', res.types)
        wx.setStorage({
          key: 'token',
          data: res.token,
          success: function(res){
            console.log(res)
            wx.redirectTo({
              url: '/pages/select/select',
            })
          },
          fail: function() {
            console.error('存储token时失败')
          }
        })
      }
    })
  }
})