var Api = require('../../utils/api.js')
var companyId, commutingTime;
Page({
  data: {
    lists: [{
      head: '',
      name: '',
      workTime: '09:01-12:00  14:00-18:00'
    },
    {
      workTime: ''
    },
    ],
    date: '2017-3-1'
  },
  onLoad: function (options) {
    this.setData({
      token: wx.getStorageSync('token')
    })

    // wx.request({
    //   url: Api.staffAttdance + wx.getStorageSync('token'),
    //   data: {
    //     today: '2017-02-28'
    //   },
    //   method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: function(res){
    //     // success
    //     console.log(res)
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //   }
    // })

    // companyId = options.companyId
    // wx.request({
    //   url: Api.worktime + wx.getStorageSync('token'),
    //   method: 'POST',
    //   success: (res) => {
    //     console.log(res)
    //     // 需要用户身份为公司合法人
    //     commutingTime = res.data.company.commutingTime //获取公司上下班时间
    //     //用于判断是否迟到等｀｀
    //   },
    // })
  },

  onShow: function () {
    this.getStaffsList()
  },

  getStaffsList: function () {
    wx.request({
      url: Api.staffsList,
      data: {
        token: this.data.token
      },
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        // success
        if (res.data.Code == 200) {
          console.log('list', res)
          this.setData({
            data: res.data.data
          })
          
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },


  dataChange: function (event) {
    console.log(event.detail.value)
    wx.request({
      url: Api.staffLock + wx.getStorageSync('token'),
      data: {
        today: event.detail.value
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        this.setData({
          lists: res.data.staffRecords.map((time) => {
            var newtime = ''
            for (var i = 0; i < time.sweeps.length; i++)
              switch (i) {
                case 0:
                  newtime += time.sweeps[i].h_m_s + '~'
                case 1:
                  newtime += time.sweeps[i].h_m_s + ' / '
                case 2:
                  newtime += time.sweeps[i].h_m_s + '~'
              }
            return Object.assign(time, { newtime: newtime })//临时赋值为false
          })
        })
      },
      fail: function (fail) {
        console.log(fail)
      },
    })
  }
})