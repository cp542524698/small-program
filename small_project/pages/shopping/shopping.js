// pages/shopping/shopping.js
//index.js
//获取应用实例
var app = getApp()
console.log(app.appName)
//var array=new Array();

Page({
  data: {
    showView: true,
    showView2: true,
    showcar: true,
    id: '',
    picurl: '',
    detailurl: '',
    sampleurl: '',
    cart: {},
    hiddenToast: true,
    toast: '',

    base_url:'https://cephcp.ztgame.com.cn/',
    num: 1,
    minusStatus: 'disabled',
    maxusStatus: 'normal',
    showView: true,
    name: '_________________________',
    address: '_________________________',
    tel: '_________________________',
  },

  showcar:function(event){
    console.log(event)
    wx.navigateTo({
      url: '../car/car',
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

  showorder:function(event){
    console.log(event)
    wx.navigateTo({
      url: '../showorder/showorder',
      success: function(res){

      },
      fail: function(res){

      },
      complete: function(res){

      }
    })
  },

  bindMaxus: function () {
    console.log("addd........")
    var num = this.data.num;
    var count = this.data.cart.Count;
    if (num < count) {
      num++;
    }
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var maxusStatus = num >= count ? 'disabled' : 'normal';
    this.setData({
      num: num,
      maxusStatus: maxusStatus,
      minusStatus: minusStatus
    })
  },

  exit_commit: function (e) {
    var that = this
    that.setData({
      showView2: true
    })
  },
  nextstep: function (e) {
    console.log(e)
    console.log("==Next funn")
    var that = this
    var name, tel, address
    try {
      name = wx.getStorageSync('username')
      tel = wx.getStorageSync('tel')
      address = wx.getStorageSync('address')
    } catch (e) {
      console.log("getStorageSync error")
      this.setData({
        toastHidden: false,
        toastStr: "抱歉，系统出错啦..."
      });
    }
    if (name && tel && address) {
      that.setData({
        name: name,
        tel: tel,
        address: address
      })
    }
    console.log(name)
    console.log(tel)
    console.log(address)
    that.setData({
      showView2: false,
      showView: true
    })
  },

  buynow: function (e) {
    console.log(e)
    var that = this
    var name = that.data.name
    var tel = that.data.tel
    var address = that.data.address
    if (name.indexOf("_____") != -1) {
      name = e.detail.value.name;
    }

    if (tel.indexOf("_____") != -1) {
      tel = e.detail.value.tel;
    }
    if (address.indexOf("_____") != -1) {
      address = e.detail.value.address;
    }
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
        that.setData({
          showView: true,
          name: name,
          address: address,
          tel: tel,
        })
        var info = {}
        info['id'] = that.data.id;  //goodid
        info['name'] = that.data.cart['Name']
        info['price'] = that.data.cart['Price']
        info['many'] = that.data.num
        var all = []
        all.push(info)

        var session
        try {
          session = wx.getStorageSync('session')
        } catch (e) {
          console.log("getStorageSync error")
          that.setData({
            hiddenToast: false,
            toast: "抱歉，系统出错啦..."
          });
        }
        var orderinfo = {}
        var fee = info['price'] * info['many']
        orderinfo['tel'] = tel
        orderinfo['name'] = name
        orderinfo['address'] = address
     
        var timeStamp, nonceStr, pack, signType, paysign
        if (session) {
          console.log("===================支付预请求=============")
          var content = "session=" + session + "&detail=" + JSON.stringify(all) + "&orderinfo=" + JSON.stringify(orderinfo) + "&fee=" + fee
          console.log(content)
          //1、向后端发送预付款请求，获取prepray_id,并返回
          wx.request({
            url: "https://cephcp.ztgame.com.cn/prepay",
            data: content,
            method: "POST",
            header: {
              //"Content-Type":"application/json"
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              console.log(res)
              if (res.data.Code == 200) {
                timeStamp = res.data.data["TimeStamp"]
                nonceStr = res.data.data["NonceStr"]
                pack = res.data.data["Package"]
                signType = res.data.data["SignType"]
                paysign = res.data.data["PaySign"]

                //2、调用wx.requestPayment,小程序端支付
                console.log(timeStamp)
                console.log(nonceStr)
                console.log(pack)
                console.log(paysign)
                if (!timeStamp || !nonceStr || !pack || !signType || !paysign) {
                  that.setData({
                    hiddenToast: false,
                    toast: "抱歉，系统出错啦...请重试"
                  });
                  return false;
                }
                wx.requestPayment({
                  timeStamp: timeStamp,
                  nonceStr: nonceStr,
                  package: pack,
                  signType: signType,
                  paySign: paysign,
                  success: function (res) {
                    // success
                    console.log(res)
                    console.log("--------支付成功")
                    that.setData({
                      hiddenToast: false,
                      toast: "支付成功"
                    })
                    console.log(res)
                  },
                  fail: function (res) {
                    // fail
                    console.log("-------dff-支付成功")
                    console.log(res)
                    that.setData({
                      hiddenToast: false,
                      toast: "支付失败"
                    })
                  },
                  complete: function (res) {
                    // complete
                  }
                })
              } else if (res.data.Code == 403) {
                that.setData({
                  hiddenToast: false,
                  toast: "登录超时，请重新登录哦"
                });
              } else {
                that.setData({
                  hiddenToast: false,
                  toast: "抱歉，系统出错啦...请重试"
                });
              }
              console.log("支付与请求成功返回")
            },
            fail: function (res) {
              that.setData({
                hiddenToast: false,
                toast: "抱歉，系统出错啦...请重试"
              });
            }
          })
        } else {
          try {
            wx.setStorage({
              key: 'hasLogin',
              data: false,
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
          this.setData({
            hiddenToast: false,
            toast: "请重新登录"
          });
        }

      } else {
        that.setData({
          hiddenToast: false,
          toast: '手机号填写有误，请重新填写',
        })
      }
    } else {
      that.setData({
        hiddenToast: false,
        toast: '收货信息有误，请重新填写',
      })
    }
  },

  pay: function (event) {
    wx.navigateTo({
      url: '../pay/pay?id=' + event.currentTarget.id
    })
  },

  bindMinus: function () {
    var num = this.data.num;
    var count = this.data.cart.Count;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    var maxusStatus = num >= count ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatuscontr
    });
  },

  listenButton: function () {
    console.log('==========================')
    var that = this
    var session
    try {
      session = wx.getStorageSync('session')
    } catch (e) {
      console.log("getStorageSync error")
    }

    console.log(this.data.id)
    var id = this.data.id + ''
    var content = "session=" + session + "&many=" + this.data.num + "&goodId=" + id
    console.log(content)
    console.log(session)
    if (session) {
      wx.request({
        url: 'https://cephcp.ztgame.com.cn/shoppingcaradd',
        //data: "session="+session + "&id=" + id + "&many=" + this.data.num,
        data: content,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { "Content-Type": "application/x-www-form-urlencoded" }, // 设置请求的 header
        success: function (res) {
          // success
          if (res.data.Code == 200) {
            that.setData({
              hiddenToast: false,
              toast: '已添加购物车'
            })
          } else if (res.data.Code = 403) {
            that.setData({
              hiddenToast: false,
              toast: '请先登录'
            })
          } else {
            that.setData({
              hiddenToast: false,
              toast: '请先登录'
            })
          }
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
    } else {
      try {
        wx.setStorage({
          key: 'hasLogin',
          data: false,
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
      that.setData({
        hiddenToast: false,
        toast: '请先登录'
      })
    }
  },

  toastHidden: function () {
    var that = this
    that.setData({
      hiddenToast: true
    })
  },

  show: function (event) {
    console.log("==================")
    var that = this
    that.setData({
      showView: false
    })
  },
  addcar: function (event) {
    var that = this
    that.setData({
      showcar: false
    })
  },

  exit_buy: function (event) {
    console.log("exit_buy====")
    var that = this
    that.setData({
      showView: true,
      showcar: true
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      id: options.id
    });
    console.log(options.id)
    var data = "id=" + options.id
    wx.request({
      url: "https://cephcp.ztgame.com.cn/getinfoOne",
      data: data,
      method: "POST",
      header: {
        //"Content-Type":"application/json"
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.Code == 200) {
          console.log(res.data.data[0])
          that.setData({
            cart: res.data.data[0],
            piccurl: "https://cephcp.ztgame.com.cn/flower_" + options.id + ".jpg",
            detailurl: "https://cephcp.ztgame.com.cn/flower_detail_" + options.id + ".png",
            sampleurl: "https://cephcp.ztgame.com.cn/flower_pic_" + options.id + ".jpg"
          })
        } else {

        }
      },
      fail: function (err) {
        console.log(err)
      }
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})