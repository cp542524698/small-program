// pages/scan/scan.js
var util = require('../../utils/utils.js')

Page({
    data: {
        now: '',
        now1: '',
        am: true,
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        that.setData({
            company: wx.getStorageSync('company'),
        })
        var now = util.formatTime(new Date, 0)
        var now1 = util.formatTime(new Date, -1)
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
    start: function(){
        var that = this
        var am = that.data.am
        var timeinfo
        if (am== true){
            //IsLate
            timeinfo = util.IsLate(new Date, that.data.company.Amstart)
        }else{
            timeinfo = util.IsLate(new Date, that.data.company.Pmstart)
        }

        var distance = util.Distance(that.data.company.Latitude, that.data.company.Longitude, that.data.src_lat, that.data.src_long, that.data.accuracy)
        console.log("距离目标地点:", distance)
    },
    stop: function(){
        var that = this
        var am = that.data.am
        var timeinfo
        if (am == true) {
            //IsLate
            timeinfo = util.IsLate(new Date, that.data.company.Amend)
        } else {
            timeinfo = util.IsLate(new Date, that.data.company.Pmend)
        }

        var distance = util.Distance(that.data.company.Latitude, that.data.company.Longitude, that.data.src_lat, that.data.src_long, that.data.accuracy)
        console.log("距离目标地点:", distance)

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



