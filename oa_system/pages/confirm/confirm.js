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
    wx.request({
      url: Api.companyDetail + this.data.id + '?token=' + this.data.token,
      data: {},
      method: 'GET',
      success: (res) => {

        this.setData({
          companyName: res.data.company.name,
          companyLocation: res.data.company.address,
        })
      },
      fail: function (fail) {
        console.log(fail)
      },
    })
  },

  checkBtn_click: function (event) {

    wx.showModal({
      title: '申请加入公司',
      content: '确定加入该公司吗？这无法变更，请仔细考虑',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: Api.joinCompany + this.data.token,
            data: {
              companyId: this.data.id
            },
            method: 'POST',
            success: (res) => {
              wx.redirectTo({
                url: '/pages/audit/audit?companyName=' + this.data.companyName + '&message=' + res.data.message
             })
            }
          })
        }
      }
    })

  }

})