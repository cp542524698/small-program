const Api = require('../../utils/api.js')

Page({
    data: {
        company: null,
        checkButton: true,
        showView2: true,
        winWidth: '',
        winHeight: '',
        name: '_________________________',
    },

    onLoad: function (options) {
        var that = this
        // 获取系统信息
        this.setData({
            id: options.companyId,
            token: wx.getStorageSync('token'),
            userid: wx.getStorageSync("userid")
        })

    },

    onShow: function () {
        this.getCompanyInfo()
    },
    //获取中间点的经纬度，并mark出来
    getLngLat: function () {
        var that = this;
        this.mapCtx = wx.createMapContext("map4select");
        this.mapCtx.getCenterLocation({
            success: function (res) {
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [
                        {
                            id: 0,
                            iconPath: "../../images/ic_position.png",
                            longitude: res.longitude,
                            latitude: res.latitude,
                            width: 30,
                            height: 30,
                        }
                    ]
                })
            }
        })
    },
    regionchange(e) {
        // 地图发生变化的时候，获取中间点，也就是用户选择的位置
        if (e.type == 'end') {
            this.getLngLat()
        }
    },
    getCompanyInfo: function () {
        var that = this
        //set the width and height
        // 动态设置map的宽和高
        wx.getSystemInfo({
            success: function (res) {
                console.log('getSystemInfo');
                console.log('map_width:', res.windowWidth)
                console.log('map_height:', res)
                that.setData({
                    map_width: res.windowWidth,
                    map_height: res.windowHeight,
                    /*
                    controls: [{
                        id: 1,
                        iconPath: '../../images/ic_location.png',
                        position: {
                            left: res.windowWidth / 2 - 8,
                            top: res.windowHeight / 2 - 16,
                            width: 30,
                            height: 30
                        },
                        clickable: true
                    }]*/
                })
            }
        })

        console.log("id:", this.data.id)
        wx.request({
            url: Api.companyDetail,  // + this.data.id + '?token=' + this.data.token,
            data: {
                token: this.data.token,
                id: this.data.id
            },
            method: 'GET',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: (res) => {
                console.log("getcompany info return:", res)
                if (res.data.Code == 200) {

                    this.setData({
                        company: res.data.data,
                        markers: [{
                            id: 0,
                            iconPath: "../../images/ic_position.png",
                            longitude: Number(res.data.data.Longitude),
                            latitude: Number(res.data.data.Latitude),
                            width: 30,
                            height: 30,
                        }]
                    })
                    wx.openLocation({
                        latitude: Number(res.data.data.Latitude),
                        longitude: Number(res.data.data.Longitude),
                        name:res.data.data.Name,
                        address: res.data.data.Address,
                        infoUrl:'/pages/log/log'
                    })
                    console.log("=====================")
                }
            },
            fail: function (fail) {
                console.log(fail)
            },
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
        if (name.indexOf("_____") >= 0) {
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
                companyId: that.data.company.Id,
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
                    url: '/pages/audit/audit?companyName=' + this.data.company.Name + '&message=已发送发送申请消息'
                })
            }
        })

    },
    checkBtn_click: function (event) {
        var that = this
        /*
        console.log("company id:", this.data.id)
        var message = "您已申请加入 " + this.data.company.Name
        var companyid = this.data.id
        var content = "确定加入"+ this.data.company.Name +"吗？"
        */
        that.setData({
            showView2: false,
        })

        /*
        wx.showModal({
          title: '申请加入',
          content: content,
          success: (res) => {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/audit/audit?companyName=' + this.data.company.Name + '&message=' + message
              })
              
              wx.request({
                url: Api.joinCompany,
                data: {
                  token: this.data.token,
                  companyId: this.data.company.Id,
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: (res) => {
                  console.log(res)
                  wx.redirectTo({
                    url: '/pages/audit/audit?companyName=' + this.data.company.Name + '&message=已发送发送申请消息'
                 })
                }
              })
            }
          }
        })*/

    }

})