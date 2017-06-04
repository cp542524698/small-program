// pages/create/create.js

var Api = require('../../utils/api.js')

Page({
  data:{
    name: '',
    location: '',
    errMsg: '',
    token: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    var token
    try {
      token = wx.getStorageSync('token')
    }catch(e){
      console.log('getStorageSync token error')
    }
    console.log("====getStorageSync: ", token)
    that.setData({
      token: token
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

  //公司输入
  handleInput: function(event) {
    this.setData({
      name: event.detail.value
    })
  },

  //选择定位
  chooseLocation: function() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res
        })
      }
    })
  },

  //创建按钮
  handleCreateCompany: function() {
    this.checkInput((res) => {
      if(res == 'success') {
        console.log('验证通过')
        this.createCompany()
      }
    })
  },

  //创建公司
  createCompany: function() {
    var apiUrl = Api.company
    var that = this
    console.log(that.data.token)
    console.log('========create company')
    console.log(this.data.location.latitude)
    console.log(this.data.location.longitude)

    wx.request({
      url: apiUrl,
      data: {
        token: this.data.token,
        name: this.data.name,
        address: this.data.location.name,
        latitude: this.data.location.latitude,
        longitude: this.data.location.longitude
      },
      method: 'POST', 
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res){
        console.log(res)
        console.log(res.data.Code)
        console.log("========================================")
        if(res.data.Code == 200) {
          try{
            wx.setStorage({
              key: 'company',
              data: res.data.data,
              success:function(res){
                //success
              },
              fail: function(res){
                wx.showToast({
                  title:'系统错误',
                  icon:'fail',
                  duration: 1000
                })
              }
            })
          }catch(e){
            return
          }

          //创建成功
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 2000
          })
      
          wx.switchTab({ url: '/pages/boss/boss'})
        }else {
          //创建失败
          if(res.data.Code == 403) {
            wx.showModal({
              title: '创建失败',
              content: '你已经创建了一个公司，点击确定查看',
              success: function(res) {
                if(res.confirm) {
                  wx.switchTab({ url: 'pages/boss/boss' })
                }
              }
            })
          }else {
            wx.showModal({
              title: '创建失败',
              content: '请您稍后再试'
            })
          }
        }
      }
    })
  },

  //验证输入信息
  checkInput: function(cb) {
    if(this.data.name == '') {
      this.setData({
        errMsg: '公司名称不能为空'
      })
    }
    else if(this.data.location == '') {
      this.setData({
        errMsg: '地址位置不能为空'
      })
    }
    else {
      this.setData({
        errMsg: ''
      })
      typeof cb == 'function' && cb('success')
    }
  }

})