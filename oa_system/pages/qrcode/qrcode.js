// pages/qrcode/qrcode.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    this.setData({
      codeUrl : options.QRCodeUrl,
      name: options.name,
      address: options.address
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
  bindLoadCode: function(event) {
    console.log(event)
  },

  //设置分享
  onShareAppMessage: function () {
      return {
          title: name,
          desc: address,
          path: '/login/login'
      }
  }
})