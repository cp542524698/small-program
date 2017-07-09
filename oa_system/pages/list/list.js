const Api = require('../../utils/api.js')

Page({
  data: {
    lists: [],
    winWidth: '',
    winHeight: '',
    showView2: true,
    companyid: null,
    companyname: null,
    name: '_________________________',
  },
  onLoad: function () {
    //设置token
    this.setData({
      token: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid")
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

  detail: function(event){
      //var companyid = event.target.id
      console.log(event)
      wx.openLocation({
          latitude: Number(event.currentTarget.dataset.lat),
          longitude: Number(event.currentTarget.dataset.lon),
          name: event.currentTarget.dataset.name,
          address: event.currentTarget.dataset.add,
          success: function(res){
            console.log(res)
          },
          
          fail: function(fail) {
              console.log(fail)
          },
      })
  },

  join: function(event){
    var that = this
    console.log(event)
    console.log("join action")
    var companyid = event.currentTarget.dataset.id
    var companyname = event.currentTarget.dataset.name
    that.setData({
        showView2: false,
        companyid: companyid,
        companyname: companyname,
    })
  },

  exit_commit: function (e) {
      var that = this
      that.setData({
          showView2: true,
      })
  },

  commit: function (event) {
      var that = this
      console.log("commit info: ", event)
      var name = event.detail.value.name;
      console.log(name)
      if (name.indexOf("_____") >= 0 || name == "") {
          wx.showToast({
              title: '请备注姓名',
              icon: 'success',
              duration: 2000
          })
          return
      }
      console.log("name:", name)
      wx.request({
          url: Api.joinCompany,
          data: {
              token: that.data.token,
              companyId: that.data.companyid,
              userid: that.data.userid,
              username: name,
          },
          method: 'POST',
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          success: (res) => {
              console.log(res)
              wx.redirectTo({
                  url: '/pages/audit/audit?companyName=' + this.data.companyname + '&message=已发送发送申请消息'
              })
          }
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
