// pages/login/login.js

var util = require('../../utils/util.js');
var Api = require('../../utils/api.js');
var app = getApp()
Page({
  data: {
    companys: [],
    token: '',
    has: false,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    /*
    console.log("onload ...........")
    wx.clearStorageSync()
    var userType = wx.getStorageSync('info')
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log("getStorage token: ", res)
        var token = res
        wx.request({
          url: Api.getinfo,
          data: {
            token: res
          },
          method: "GET",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res)
            if (res.data.Code == 200) {
              wx.setStorage({
                key: 'info',
                data: res.data.data,
                success: function (res) {
                  console.log(res)
                },
                fail: function () {
                  console.error('存储信息失败')
                }
              })
              var len = false
              if (res.data.data.length > 0) {
                len = true
              }
              this.setData({
                has: true,
                token: token,
                companys: res.data.data,
              })
            } else {
              console.log("获取身份失败")
            }
          },
          fail: function (res) {
            console.log(res)
          },
        })
      },
      fail: function () {
        // 说明未登录
      }
    })*/
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log("===========================")
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  into: function (event) {
    console.log("=============", event)
    var companyid = event.target.id
    var info = this.data.companys
    var token = this.data.token
    var title = -1
    for (var i = 0; i < info.length; i++) {
      if (companyid == info[i].Id) {
        title = info[i].Title
        break
      }
    }
    console.log(title)
    title = 2
    if (title == 0 || title==1) {  //创始人 或管理员
      wx.request({
        url: Api.companyDetail,
        data: {
          token: token,
          id: companyid,
        },
        method: "GET",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res)
          if (res.data.Code == 200) {
            wx.setStorage({
              key: 'company',
              data: res.data.data,
              success: function (res) {
                console.log("setStrorage success")
              },
              fail: function () {
                console.error('setStorage token failed')
              }
            })

            if(title==0){
              wx.switchTab({ url: '/pages/boss/boss' })
            }else {
              console.log("woker/woker2.....")
              wx.redirectTo({
                url: '/pages/workers2/workers2',
              })
            }
          }else{
            console.log("获取company信息错误")
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else if (title == 2) {   //普通员工
      console.log("------------------------")
      wx.redirectTo({
        url: '/pages/scan/scan',
        //url: '/pages/self/self',
      })
    } else {
      wx.redirectTo({
        url: '/pages/self/self',
      })
    }
    /*
    wx.redirectTo({
      url: '/pages/',
    })*/
  },

  handleLoginBtn() {
    var that = this
    util.getToken((res) => {
      console.log(res)
      //用户拒绝授权
      if (res.errMsg == 'userDenyed') {
        wx.redirectTo({
          url: '/pages/unAuth/unAuth',
        })
      }
      //用户允许授权
      else {
        if (res.Code == 200) {
          console.log("res", res)
          /*wx.setStorage('userType', res.types)
          wx.redirectTo({
                url: '/pages/select/select',
              })
          wx.setStorage({
             key: 'userType',
             data: res.types,
             success: function(res){
               console.log("setStrorage success")
             },
             fail: function(){
               console.error('setStorage token failed')
             }
          })*/
          var token = res.data
          this.setData({
            token: token,
          })
          wx.setStorage({
            key: 'token',
            data: token,
            success: function (res) {
              wx.request({
                url: Api.getrelation,
                data: {
                  token: token
                },
                method: "GET",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  console.log(res)
                  var len = false
                  if (res.data.Code == 200) {
                    if (res.data.data != null) {
                      len = true
                    }
                    wx.setStorage({
                      key: 'info',
                      data: res.data.data,
                      success: function (res) {
                        console.log(res)
                      },
                      fail: function () {
                        console.error('存储信息失败')
                      }
                    })
                    if (len == false) {
                      wx.redirectTo({
                        url: '/pages/select/select',
                      })
                    } else {
                      console.log(res.data.data)
                      that.setData({
                        has: len,
                        companys: res.data.data,
                      })
                    }
                  }
                },
                fail: function (err) {
                  console.log(err)
                }
              })
            },
            fail: function () {
              console.error('存储token时失败')
            }
          })
        } else {
          console.error('系统错误，请重试')
        }
      }
    })
  }
})