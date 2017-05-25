var app = getApp()
console.log(app.appName)

Page({
  data: {
    hasLogin: false,
    userInfo: {},
    loginimg: "login.png",
    base_url: 'https://cephcp.ztgame.com.cn/',
    hiddenToast: true,
    showView: true,
    username: '',
    tel: '',
    address: '',
    toastStr: '',
  },
  toastHidden: function () {
    var that = this
    that.setData({
      hiddenToast: true
    })
  },
  show_car: function (event) {
    wx.navigateTo({
      url: '../car/car'
    })

  },
  onLoad: function (options) {
    var that = this
        var hasLogin
        try {
            hasLogin = wx.getStorageSync('hasLogin')
        } catch (e) {
            console.log("getStorageSync error")
            that.setData({
                hiddenToast: false,
                toastStr: "抱歉，系统出错啦..."
            });
        }
        if (hasLogin) {
          that.setData({
            hasLogin: hasLogin
          })
        }else{
          that.setData({
            hasLogin: false
          })
        }
  },

  formSubmit: function (e) {
    console.log(e)
    var that = this
    var name = e.detail.value.name;
    var tel = e.detail.value.tel;
    var address = e.detail.value.address;

    if (tel != null && name != null && address != null) {
      var length = tel.length;
      if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(tel)) {
        try {
          wx.setStorage({
            key: 'username',
            data: name,
            success: function (res) {
              // success
              console.log("setStorage success==========")
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        } catch (e) {
          console.log(e)
        }

        try {
          wx.setStorage({
            key: 'tel',
            data: tel,
            success: function (res) {
              // success
              console.log("setStorage success==========")
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        } catch (e) {
          console.log(e)
        }
        try {
          wx.setStorage({
            key: 'address',
            data: address,
            success: function (res) {
              // success
              console.log("setStorage success==========")
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          })
        } catch (e) {
          console.log(e)
        }
      } else {
        that.setData({
          showView: false,
          hiddenToast: false,
          toastStr: "手机号码有误"
        });
      }
    }
      that.setData({
        showView: true,
        hiddenToast: false,
        toastStr: "更新成功"
      });
  },


  show_address: function (event) {
    var that = this
    var username, tel, address
    try {
      username = wx.getStorageSync('username')
      tel = wx.getStorageSync('tel')
      address = wx.getStorageSync('address')
    } catch (e) {
      console.log("getStorageSync error")
      that.setData({
        hiddenToast: false,
        toastStr: "抱歉，系统出错啦..."
      });
    }
    if (username && tel && address) {
      that.setData({
        showView: false,
        username: username,
        tel: tel,
        address: address,
      })

    } else {
      that.setData({
        hiddenToast: false,
        toastStr: '暂无地址信息'
      })
    }
  },
  show_order: function (event) {
    wx.navigateTo({
      url: '../showorder/showorder'
    })

  },

  /*
    show_order: function (event) {
      console.log(event)
      var session
      try {
        session = wx.getStorageSync('session')
      } catch (e) {
        console.log("getStorageSync error")
        that.setData({
          hiddenToast: false,
          toastStr: "抱歉，系统出错啦..."
        });
      }
      if (session) {
        wx.request({
          url: "https://cephcp.ztgame.com.cn/showorder",
          data: "session=" + session,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      } else {
        that.setData({
          hiddenToast: false,
          toastStr: "请登录"
        });
      }
    },*/

  login: function (event) {
    console.log("=====")
    var that = this
    wx.login({
      success: function (res) {
        console.log("wxlogin successed.....")
        //app.globalData.hasLogin = true 
        var rt = "code=" + res.code
        console.log(rt)
        if (res.code) {
          wx.request({
            url: 'https://cephcp.ztgame.com.cn/login',
            method: "POST",
            data: rt,
            header: {
              //"Content-Type":"application/json"
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res.data)
              if (res.data.Code == 200) {
                var session = res.data.data
                try {
                  wx.setStorage({
                    key: 'session',
                    data: session,
                    success: function (res) {
                      // success
                      console.log("setStorage success==========")
                    },
                    fail: function (res) {
                      // fail
                    },
                    complete: function (res) {
                      // complete
                    }
                  })
                } catch (e) {
                  console.log(e)
                }
                try {
                  wx.setStorage({
                    key: 'hasLogin',
                    data: true,
                    success: function (res) {
                      // success
                      console.log("setStorage success==========")
                    },
                    fail: function (res) {
                      // fail
                    },
                    complete: function (res) {
                      // complete
                    }
                  })
                } catch (e) {
                  console.log(e)
                }

                app.getUserInfo(function (userInfo) {
                  //更新数据
                  that.setData({
                    userInfo: userInfo,
                    hasLogin: true,
                    loginimg: "login1.png"
                  })
                })
              } else {
                that.setData({
                  hiddenToast: false
                })
              }
            },
            /*
            try {
                wx.setStorageSync('personal', 'res.data')
            }catch(e){
                console.log("setStorageSync error")    
            }
            that.setData({
              hasLogin: true
            })*/

            fail: function (err) {
              console.log(err)
            }
          })
          that.setData({
            hasLogin: true
          })
        } else {
          console.log("login failed" + res.errMsg)
        }
        that.update()
      }
    })
  }
})

