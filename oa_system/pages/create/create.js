// pages/create/create.js

var Api = require('../../utils/api.js')

Page({
  data:{
    name: null,
    location: null,
    errMsg: null,
    token: null,
    longitude: null,
    latitude: null,
    markers: null,
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
    wx.getLocation({
        type: 'gcj02',
        success: function (res) {
            that.setData({
                longitude: res.longitude,
                latitude:  res.latitude,
                markers:[{
                  id: 0,
                  iconPath: "../../images/ic_position.png",
                  longitude: res.longitude,
                  latitude:  res.latitude,
                  width: 30,
                  height: 30,
                }]
            })
        },
        fail: function (res) {
            console.log("getLocation fail:", res)
        }
    })
        //set the width and height
        // 动态设置map的宽和高
        wx.getSystemInfo({
            success: function (res) {
                console.log('getSystemInfo');
                console.log(res.windowWidth);
                that.setData({
                    map_width: res.windowWidth,
                    map_height: res.windowWidth,
                    controls: [{
                        id: 1,
                        iconPath: '../../images/ic_location.png',
                        position: {
                            left: res.windowWidth / 2 - 8,
                            top: res.windowWidth / 2 - 16,
                            width: 30,
                            height: 30
                        },
                        clickable: true
                    }]
                })
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

  //公司输入
  handleInput: function(event) {
    this.setData({
      name: event.detail.value
    })
  },

  //获取中间点的经纬度，并mark出来
  getLngLat: function () {
        var that = this;
        this.mapCtx = wx.createMapContext("map4select");
        this.mapCtx.getCenterLocation({
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [
                        {
                            id: 0,
                            iconPath: "../../images/ic_position.png",
                            longitude: res.longitude,
                            latitude: res.latitude,
                            width: 30,
                            height: 30,
                        }
                    ]
                })
            }
        })
    },
    regionchange(e) {
        // 地图发生变化的时候，获取中间点，也就是用户选择的位置
        if (e.type == 'end') {
            this.getLngLat()
        }
    },
    markertap(e) {
        console.log(e)
    },
  //选择定位
  chooseLocation: function() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res,
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [{
              id: 0,
              iconPath: "../../images/ic_position.png",
              longitude: res.longitude,
              latitude: res.latitude,
              width: 30,
              height: 30,
          }]
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
    if(that.data.name == null){
        wx.showToast({
            title: '请输入公司名',
            icon: 'success',
            duration: 1000
        })
        return 
    }
    if (that.data.location == null) {
        wx.showToast({
            title: '请选中公司定位',
            icon: 'success',
            duration: 1000
        })
        return
    }

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
        console.log("creatCompany: ",res)
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