// pages/boss/boss.js

var Api = require('../../utils/api.js');

Page({
  data: {
    company: '',
    AMstart: '09:00',
    AMend: '12:00',
    PMstart: '14:00',
    PMend: '18:00'

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    this.setData({
      company: wx.getStorageSync('company'),
      token: wx.getStorageSync('token')
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    //this.getInformation()
    this.setData({
      company: wx.getStorageSync('company')
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  //获取公司信息
  getInformation: function () {
    wx.request({
      url: Api.information,
      data: {
        token: this.data.token
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        // success
        console.log(res)
        if (res.data.Code = 200) {
          this.setData({
            company: res.data.company,
            AMstart: res.data.company.commutingTime[0],
            AMend: res.data.company.commutingTime[1],
            PMstart: res.data.company.commutingTime[2],
            PMend: res.data.company.commutingTime[3],
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

  //去修改公司名称
  toCompanyName: function () {
    wx.navigateTo({
      url: '/pages/name/name?name=' + this.data.company.Name + '&id=' + this.data.company.Id,
    })
  },

  //去修改公司地理位置
  toLocation: function () {
    wx.chooseLocation({
      success: (res) => {
        // success
        wx.request({
          url: Api.changLocation,
          data: {
            token: this.data.token,
            id: this.data.company.Id,
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: (res1) => {
            console.log(res1)
            if (res1.data.Code == 200) {
              //this.getInformation()

              var company = wx.getStorageSync('company')
              company.Address= res.address
              company.latitude = res.latitude
              company.longitude = res.longitude
              this.setDat({
                company: company
              })
              try {
                wx.setStorage({
                  key: 'company',
                  data: company,
                  success: function (res) {
                    //success
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: '系统错误',
                      icon: 'fail',
                      duration: 1000
                    })
                  }
                })
              } catch (e) {
                return
              }

              wx.showToast({
                title: '更新地理位置成功',
                icon: 'success',
                duration: 2000
              })
            }else{
              wx.showToast({
                title: '更新地理位置失败，请重试',
                icon: 'fail',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },

  //上下班时间监听函数设置
  bindTimeChange: function (event) {
    var value = event.detail.value
    var time = event.currentTarget.dataset.time
    var company = this.data.company;
    switch (time) {
      case 'AMstart': company.Amstart = value
        break;
      case 'AMend': company.Amend = value
        break;
      case 'PMstart': company.Pmstart = value
        break;
      case 'PMend': company.Pmend = value  
        break;
      default:
        break;
    }
    this.setData({
      company: company
    })
  },

  //保存修改的上下班时间
  saveCommuterTime: function () {
    wx.request({
      url: Api.savetime,
      data: {
        id: this.data.company.Id,
        token: this.data.token,
        amstart: this.data.company.Amstart,
        amend: this.data.company.Amend,
        pmstart: this.data.company.Pmstart,
        pmend: this.data.company.Pmend,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        // success
        console.log(res)
        if (res.data.Code == 200) {
          //var company = wx.getStorageSync('company')
          var company = this.data.company
          try {
            wx.setStorage({
              key: 'company',
              data: company,
              success: function (res) {
                //success
              },
              fail: function (res) {
                wx.showToast({
                  title: '系统错误',
                  icon: 'fail',
                  duration: 1000
                })
              }
            })
          } catch (e) {
            return
          }

          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败，请重试',
            icon: 'fail',
            duration: 10000
          })
        }
      }
    })
  },

  //生产二维码
  getQRCode: function () {
    wx.request({
      url: Api.qrcode + this.data.token,
      data: {},
      method: 'GET',
      success: (res) => {
        wx.navigateTo({
          url: '/pages/qrcode/qrcode?QRCodeUrl=' + res.data.QRCodeUrl
          + '&name=' + this.data.company.name
          + '&address=' + this.data.company.address,
        })
      }
    })
  },

  //申请列表
  toApplyList: function () {
    wx.navigateTo({
      url: '/pages/applylist/applylist',
    })
  },

  //解散企业
  dissolveCompany: function () {
    wx.showModal({
      title: '警告',
      content: '解散企业会清空所有信息，您确定要解散企业吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: Api.deleteCompany + this.data.token,
            data: {},
            method: 'DELETE',
            success: function (res) {
              // success
              if (res.data.code == 200) {
                wx.setStorage({
                  key: 'userType',
                  data: 'user',
                  success: function (res) {
                    // success
                    wx.redirectTo({ url: '/pages/select/select' })
                  }
                })
              }
              else {
                wx.showModal({
                  title: '提示',
                  content: '解散企业失败，请稍后再试'
                })
              }
            }
          })
        }
      }
    })
  }
})