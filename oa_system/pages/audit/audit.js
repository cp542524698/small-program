// pages/audit/audit.js
Page({
  data:{
    winHeight: '',
    winWidth: '',
    message: '',
    companyName: '',
  },
  onLoad:function(options){
      var that=this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData(
          {
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            message: options.message,
            companyName: options.companyName,
          });
      }
    });
  },

  onUnload: function () {
      // 页面关闭
      //进行对token， userid的缓存进行清除
      try{
        wx.removeStorageSync('token')
      }catch(e){
        console.log("removeSync error")
      }
      try{
        wx.removeStorageSync('userid')
      }catch(e){
          console.log("removeSync error")
      }
  },
})