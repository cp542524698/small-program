const Api = require('../../utils/api.js')

Page({
  data: {
    companyName: '',
    companyLocation: '',
    checkButton: true,
    winWidth: '',
    winHeight: '',
  },

  onLoad: function (options) {
    // 获取系统信息
    wx.getSystemInfo({ 
      success: (res) => {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })

    this.setData({
      id: options.companyId,
      token: wx.getStorageSync('token')
    })

  },

  onShow: function() {
    this.getCompanyInfo()
  },

  getCompanyInfo: function() {
    console.log("id:", this.data.id)
    wx.request({
      url: Api.companyDetail,  // + this.data.id + '?token=' + this.data.token,
      data: {
        token: this.data.token,
        id: this.data.id
      },
      method: 'GET',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },      

      success: (res) => {
        console.log("getcompany info return:", res)
        this.setData({
          companyName: res.data.data.Name,
          companyLocation: res.data.data.Address,
        })
      },
      fail: function (fail) {
        console.log(fail)
      },
    })
  },

  checkBtn_click: function (event) {
    var message = "TTTTTTTXXXXXXXXXXXXXXXXX"
    wx.showModal({
      title: '申请加入公司',
      content: '确定加入该公司吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/audit/audit?companyName=' + this.data.companyName + '&message=' + message
          })
          /*
          wx.request({
            url: Api.joinCompany,
            data: {
              token: this.data.token,
              companyId: this.data.id,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (res) => {
              console.log(res)
              wx.redirectTo({
                url: '/pages/audit/audit?companyName=' + this.data.companyName + '&message=' + res.data.message
             })
            }
          })*/
        }
      }
    })

  }

})