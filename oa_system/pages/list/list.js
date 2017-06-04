const Api = require('../../utils/api.js')

Page({
  data: {
    lists: [],
    winWidth: '',
    winHeight: ''
  },
  onLoad: function () {
    //设置token
    this.setData({
      token: wx.getStorageSync('token')
    })

    // 获取系统信息 
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })

  },

  onShow: function () {
    this.getCompanyList()
  },

  //获取已创建的公司列表
  getCompanyList: function () {
    wx.request({
      url: Api.companyList,
      data: {
        token: this.data.token
      },
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      success: (res) => {
        console.log(res)
        if (res.data.Code == 200) {
          var companies =[]
          this.setData({
            lists: res.data.data
          })
        }else{
          console.log('request company error')
        }
      },
      fail: function (fail) {
        console.log(fail)
      },
    })
  },

  //事件处理函数
  item_click: function (event) {
    var id = event.currentTarget.dataset.companyid
    console.log("item_click id:", id)
    wx.navigateTo({
      url: '/pages/confirm/confirm?companyId=' + id
    })
  },
})
