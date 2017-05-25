//index.js
//获取应用实例
var app = getApp()
console.log(app.appName)
//var array=new Array();
Page({
    data: {
        carts: [],
        hiddenToast: true,
        toastStr: '',
        detail: [],
        info: {},
        total: 0,
    },
    showdetail: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var that = this;
        var carts = that.data.carts;
        that.setData({
            detail: carts[index]["Detail"],
            info: carts[index]["Info"],
            total: carts[index]["Total"]
        })
        console.log(that.data.detail)
    },
    bindToastChange: function () {
        this.setData({
            toastHidden: true
        });
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        console.log(event)
        var session
        try {
            session = wx.getStorageSync('session')
        } catch (e) {
            console.log("getStorageSync error")
            that.setData({
                hiddenToast: false,
                toastStr: "抱歉，系统出错啦..."
            });
        }
        if (session) {
            wx.request({
                url: "https://cephcp.ztgame.com.cn/showorder",
                data: "session=" + session,
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    console.log(res)
                    if (res.statusCode == 403) {
                        that.setData({
                            hiddenToast: false,
                            toastStr: "请登录"
                        })
                    } else if (res.statusCode == 200) {

                        console.log(res.data.data)
                        var carts = res.data.data;
                        for (var i = 0; i < carts.length; i++) {
                            console.log(carts[i])
                            var detail_arr = JSON.parse(carts[i]["Detail"])
                            for (var j = 0; j < detail_arr.length; j++) {
                                console.log(detail_arr[j])
                                var myid = detail_arr[j]["id"]
                                detail_arr[j]["id"] = "https://cephcp.ztgame.com.cn/flower_pic_" + myid + ".jpg"
                                console.log(detail_arr[j]["id"])
                            }
                            carts[i]["Detail"] = detail_arr;

                            var info = JSON.parse(carts[i]["Info"])
                            carts[i]["Info"] = info;
                        }
                        if (carts.length > 1) {
                            that.setData({
                                carts: carts
                            })
                        } else {
                            that.setData({
                                carts: carts,
                                hiddenToast: false,
                                toastStr: "没有订单哦"
                            })
                        }
                    } else {
                        that.setData({
                            hiddenToast: false,
                            toastStr: "系统错误，请重试"
                        })
                    }
                },
                fail: function (err) {
                    console.log(err)
                    that.setData({
                        hiddenToast: false,
                        toastStr: "系统错误，请重试"
                    })
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
                toastStr: "请登录"
            });
        }
    },
})