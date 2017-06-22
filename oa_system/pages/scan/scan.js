// pages/scan/scan.js
var util = require('../../utils/utils.js')
var Api = require('../../utils/api.js');

Page({
    data: {
        now: '',
        now1: '',
        showView: false,
        am: true,
        whichtime: '',
        amstart: null,
        amend: null,
        pmstart: null,
        pmend: null,
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        that.setData({
            company: wx.getStorageSync('company'),
            token: wx.getStorageSync('token'),
            userid: wx.getStorageSync('userid')
        })
        var now = util.formatTime(new Date, 0)
        var now1 = util.formatTime(new Date, -1)
        console.log(that.data.company.Amend)
        var am = util.formatTime(new Date, that.data.company.Amend)
        that.setData({
            now: now,
            now1: now1,
            am: am,
        })
        var latitude = this.data.latitude
        var longitude = this.data.longitude
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                console.log("getLocation success:", res)
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
                that.setData({
                    src_lat: latitude,
                    src_long: longitude,
                    accuracy: accuracy,
                })
            },
            fail: function (res) {
                console.log("getLocation fail:", res)
            }
        })
        wx.request({
            url: Api.gettime,
            data: {
                token: that.data.token,
                userid: that.data.userid,
                companyid: that.data.company.Id,
            },
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                if (res.data.Code == 200) {
                    if (res.data.data != null) {
                        for (var i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].Whichtime == 0) {
                                console.log(res.data.data[i])
                                that.setData({
                                    amstart: res.data.data[i]
                                })
                            } else if (res.data.data[i].Whichtime == 1) {
                                that.setData({
                                    pmstart: res.data.data[i]
                                })
                            } else if (res.data.data[i].Whichtime == 2) {
                                that.setData({
                                    amend: res.data.data[i]
                                })
                            } else if (res.data.data[i].Whichtime == 3) {
                                that.setData({
                                    pmend: res.data.data[i]
                                })
                            } else {
                                console.log("get info error")
                            }
                        }
                    }
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
        console.log(that.data.company)
        console.log(that.data.now)
        /*
        wx.scanCode({
            success: function (res) {
                console.log(res)
            },
            console.log("----------------------scan")
      fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
        console.log("=======scan here")
        */
    },
    start: function () {
        var that = this
        var am = that.data.am
        var timeinfo
        var whichtime = -1
        if (am == true) {
            //IsLate
            timeinfo = util.IsLate(new Date, that.data.company.Amstart)
            whichtime = 0
        } else {
            timeinfo = util.IsLate(new Date, that.data.company.Pmstart)
            whichtime = 1
        }

        var distance = util.Distance(that.data.company.Latitude, that.data.company.Longitude, that.data.src_lat, that.data.src_long, that.data.accuracy)
        var late = timeinfo[0]
        var worktime = timeinfo[1]
        var showview = true
        that.setData({
            showView: showview,
            worktime: worktime,
            late: late,
            distance: distance,
            whichtime: whichtime
        })
        console.log("距离目标地点:", distance)
    },
    stop: function () {
        var that = this
        var am = that.data.am
        var timeinfo
        var whichtime = -1
        if (am == true) {
            //IsLate
            timeinfo = util.IsLate(new Date, that.data.company.Amend)
            whichtime = 2
        } else {
            timeinfo = util.IsLate(new Date, that.data.company.Pmend)
            whichtime = 3
        }

        var distance = util.Distance(that.data.company.Latitude, that.data.company.Longitude, that.data.src_lat, that.data.src_long, that.data.accuracy)
        console.log("距离目标地点:", distance)
        var late = timeinfo[0]
        var worktime = timeinfo[1]
        var showview = true
        that.setData({
            whichtime: whichtime,
            worktime: worktime,
            late: late,
            distance: distance,
            showView: showview,
        })

    },

    commit: function () {
        var that = this
        wx.request({
            url: Api.commit,
            data: {
                token: that.data.token,
                userid: that.data.userid,
                companyid: that.data.company.Id,
                worktime: that.data.worktime,
                late: that.data.late,
                distance: that.data.distance,
                whichtime: that.data.whichtime,
            },
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                if (res.data.Code == 200) {
                    that.setData({
                        showView: false,
                    })
                    wx.showToast({
                        title: '签到成功',
                        icon: 'success',
                        duration: 2000
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: '签到失败,请重试',
                    icon: 'success',
                    duration: 2000
                })
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



