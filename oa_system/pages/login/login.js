// pages/login/login.js

var util = require('../../utils/util.js');
var Api = require('../../utils/api.js');
var app = getApp()
Page({
    data: {
        companys: [],
        token: null,
        userid: null,
        has: false,
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this
        console.log('onLoad')
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
        //更新数据
        that.setData({
            userInfo:userInfo
            })
        })
        var token, userid = null
        try {
            token = wx.getStorageSync('token')
        } catch (e) {
            console.log('getStorageSync token error')
        }
        try{
            userid = wx.getStorageSync('userid')
        }catch (e){
            console.log('getStorageSync userid error')
        }
        console.log("token:", token)
        if(token == '' || userid== ''){
            that.setData({
                token: null,
                userid: null
            })
        }else{
            that.setData({
                token: token,
                userid : userid
            })
            that.getcompany(token)
        }
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
    },

    into: function (event) {
        var companyid = event.target.id
        var info = this.data.companys
        var token = this.data.token
        var title = -1
        for (var i = 0; i < info.length; i++) {
            if (companyid == info[i].Id) {
                title = info[i].Title
                break
            }
        }
        wx.request({
            url: Api.companyDetail,
            data: {
                token: token,
                id: companyid,
            },
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                if (res.data.Code == 200) {
                    wx.setStorage({
                        key: 'company',
                        data: res.data.data,
                        success: function (res) {
                            console.log("setStrorage success")
                        },
                        fail: function () {
                            console.error('setStorage token failed')
                        }
                    })
                } else {
                    console.log("获取company信息错误")
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
        console.log(title)
        //title = 2
        if (title == 0) {  //创始人 或管理员
            wx.switchTab({ url: '/pages/boss/boss' })
        } else if (title == 1) {
            console.log("woker/woker2.....")
            wx.redirectTo({
                url: '/pages/workers2/workers2',
            })
        } else if (title == 2) {   //普通员工
            wx.redirectTo({
                url: '/pages/scan/scan',
                //url: '/pages/self/self',
            })
        } else {
            wx.redirectTo({
                url: '/pages/self/self',
            })
        }
        /*
        wx.redirectTo({
          url: '/pages/',
        })*/
    },

    handleLoginBtn: function() {
        var that = this
        util.getToken((res) => {
            console.log(res)
            //用户拒绝授权
            if (res.errMsg == 'userDenyed') {
                wx.redirectTo({
                    url: '/pages/unAuth/unAuth',
                })
            }
            //用户允许授权
            else {
                if (res.Code == 200) {
                    console.log("res", res)
                    var token = res.data.Session
                    var userid = res.data.Id
                    this.setData({
                        token: token,
                    })
                    wx.setStorage({
                        key: 'userid',
                        data: userid,
                    })

                    wx.setStorage({
                        key: 'token',
                        data: token,
                        success: function (res) {
                            that.getcompany(token)
                            /*
                            wx.request({
                                url: Api.getrelation,
                                data: {
                                    token: token
                                },
                                method: "GET",
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                success: function (res) {
                                    console.log(res)
                                    var len = false
                                    if (res.data.Code == 200) {
                                        if (res.data.data != null) {
                                            len = true
                                        }
                                        wx.setStorage({
                                            key: 'info',
                                            data: res.data.data,
                                            success: function (res) {
                                                console.log(res)
                                            },
                                            fail: function () {
                                                console.error('存储信息失败')
                                            }
                                        })
                                        if (len == false) {
                                            wx.redirectTo({
                                                url: '/pages/select/select',
                                            })
                                        } else {
                                            console.log(res.data.data)
                                            that.setData({
                                                has: len,
                                                companys: res.data.data,
                                            })
                                        }
                                    }
                                },
                                fail: function (err) {
                                    console.log(err)
                                }
                            })*/
                        },
                        fail: function () {
                            console.error('存储token时失败')
                        }
                    })
                } else {
                    console.error('系统错误，请重试')
                }
            }
        })
    },

    handleCreateBtn: function () {
        wx.navigateTo({
            url: '/pages/create/create',
        })
    },

    handleJoinBtn: function () {
        wx.navigateTo({
            url: '/pages/list/list',
        })
    },
    getcompany: function (token) {
        var that = this
        wx.request({
            url: Api.getrelation,
            data: {
                token: token
            },
            method: "GET",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                var len = false
                if (res.data.Code == 200) {
                    if (res.data.data != null) {
                        len = true
                    }
                    wx.setStorage({
                        key: 'info',
                        data: res.data.data,
                        success: function (res) {
                            console.log(res)
                        },
                        fail: function () {
                            console.error('存储信息失败')
                        }
                    })

                    that.setData({
                        has: len,
                        companys: res.data.data,
                    })
                    /*****
                    if (len == false) {
                        wx.redirectTo({
                            url: '/pages/select/select',
                        })
                    } else {
                        console.log(res.data.data)
                        that.setData({
                            has: len,
                            companys: res.data.data,
                        })
                    }*/
                }else if (res.data.Code == 403){
                    that.setData({
                        token: null,
                        userid: null
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
})