//index.js
//获取应用实例
var app = getApp()
console.log(app.appName)
//var array=new Array();
var index=0;

//通过page()函数来注册页面
Page({
  data: {
    motto: 'Hello World',
    base_url: 'https://cephcp.ztgame.com.cn/',    
  },

  //设置分享
  onShareAppMessage: function() {
     return {
      title: '稣予的花园',
      desc: '最具人气的花草聚集地',
      path: '/page/index?id=123'
    }
  },

  //事件处理函数
  index_rose:function(event){
    console.log(event)
    console.log(event.currentTarget.id)
    wx.navigateTo({
      url:'../shopping/shopping?id=' + event.currentTarget.id 
    }) 
  },
  
  send_01:function(event){
    console.log(event)
    wx.navigateTo({
    //wx.redirectTo({
      url:'../send/send'
    })
  },

  scale:function(){
    wx.navigateTo({
    //wx.redirectTo({
      url: '../logs/logs',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

    scale_card:function(){
    wx.navigateTo({
      url: '../logs/logs',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  listenSwiper:function(event){
      console.log(event)
  },

  click: function () { 
    var array= new Array("/image/index_01.png","/image/index_02.png");         
    var myimg=document.getElementById("imgs"); 
    if(index==array.length-1){ 
      index=0; 
    }else{ 
      index++; 
    } 
    myimg.src=array[index]; 
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    that.setData({
      base_url: app.globalData.base_url
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
