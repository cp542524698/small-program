// pages/applylist/applylist.js

var Api = require('../../utils/api.js');

Page({
  data:{
    list: []
  },
  onLoad:function(options){

    this.setData({
      token: wx.getStorageSync('token')
    })

    this.getApplyList()
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

  getApplyList: function() {
    wx.request({
      url: Api.applylist + this.data.token,
      data: {},
      method: 'GET',
      success: (res) => {
        console.log(res)
        this.setData({
          list: res.data.applycache.applyMember
        })
      }
    })
  },

  handleRefuse: function(event) {
    var id = event.currentTarget.dataset.id;
    this.handleApply(id, 'nopass', () => {
      this.getApplyList()
    })
  },

  handleAccept: function(event) {
    var id = event.currentTarget.dataset.id;
    this.handleApply(id, 'pass', () => {
      this.getApplyList()
    })
  },

  handleApply: function(id, validation, cb) {
    wx.request({
      url: Api.verifyApply + id + '?token=' + this.data.token,
      data: {
        validation: validation
      },
      method: 'POST',
      success: function(res){
        // success
        if(res.data.code == 200) {
          typeof cb === 'function' && cb()
        }
      }
    })
  }
  
})