var Api = require('../../utils/api.js')
var util = require('../../utils/utils.js')

Page({
    data: {
        stafflist: null,
        userid: null,
        companyid: null,
        token: null,
        records: null,
    },

    onLoad: function (options) {
        var that = this
        this.setData({
            userid: options.userid,
            companyid: options.companyid,
            token: wx.getStorageSync('token')
        })
        console.log("userid:", that.data.userid)
        console.log("companyid:", that.data.companyid)
        console.log("token:", that.data.token)

        wx.request({
            url: Api.detail,
            data: {
                userid: options.userid,
                companyid: options.companyid,
                token: that.data.token,
            },
            method: 'GET',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: (res) => {
                console.log("detail onLoad: ", res)
                var contents = []
                var newMap = new Map()
                var dayinfo = []

                if (res.data.Code == 200) {
                    var date = new Date()
                    var today = date.getDate()
                    console.log(today)
                    for (var j = 1; j <= today; j++) {
                        var now = util.monthDay(j)
                        console.log("time for: ", now)
                        var _time = { "_time": now }
                        if (res.data.data != null) {
                            for (var i = 0; i < res.data.data.length; i++) {
                                if (res.data.data[i].Worktime.indexOf(now) >= 0) {
                                    console.log("----------------")
                                    dayinfo.push(res.data.data[i])

                                    /*
                                     if ( newMap.has(now)){
                                         console.log("has key:", newMap[now])
                                         console.log(newMap[now])
                                         dayinfo.push(res.data.data[i])
                                         newMap.set(now, dayinfo)
                                     }else{
                                         console.log("-----first")
                                         dayinfo.push(res.data.data[i])
                                         newMap.set(now,dayinfo)
                                         console.log(newMap)
                                     }*/
                                }
                            }
                        }
                        /*
                        if ( newMap[now] != "empty"){
                            console.log("newMap value:", newMap[now])
                            contents.push(newMap)
                        }
                        newMap.clear()
                        */
                        console.log("dayinfo: ", dayinfo, " now:", now)
                        if (dayinfo.length > 0) {
                            var newarray = []
                            newarray.push(_time, dayinfo)
                            //newMap.set(_time, dayinfo)
                            contents.push(newarray)
                            //newMap = new Map()
                            //console.log("newMap", newMap)
                        }
                        dayinfo = []
                        console.log("this data:", newMap)
                    }
                    console.log("this data last:", contents)
                    that.setData({
                        records: contents
                    })
                }
            },
            fail: function (fail) {
                console.log(fail)
            },
        })
    }
})