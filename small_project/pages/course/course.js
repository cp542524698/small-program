//index.js
//获取应用实例
var app = getApp()
console.log(app.appName)
//var array=new Array();
var index = 0;

var initData = 'this is first line\nthis is second line'
Page({
    data: {
        text: initData,
        menu: [
            {
                name: "花艺沙龙"
            }, {
                name: "园艺沙龙"
            }, {
                name: "网络课程"
            }
        ],
        extraLine: [],
        carts: [],
        hiddenToast: true,
        toastStr: '',
        carts0: [],
        carts1: [],
        carts2: [],
        selected: -1
    },
    //设置分享
    onShareAppMessage: function () {
        return {
            title: '稣予的花园',
            desc: '最具人气的花草聚集地',
            path: '/page/course?id=123'
        }
    },
    bindToastChange: function () {
        this.setData({
            toastHidden: true
        });
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        console.log(options)
        var that = this
        wx.request({
            url: "https://cephcp.ztgame.com.cn/showcourse",
            data: "id=-1",
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                if (res.data.Code == 200) {
                    var carts = res.data.data
                    var change0 = []
                    var change1 = []
                    var change2 = []
                    for (var i = 0; i < carts.length; i++) {
                        carts[i]["Id"] = "https://cephcp.ztgame.com.cn/course_" + carts[i]["Id"] + ".jpg"
                        if (carts[i]["Type"] == 0) {
                            change0.push(carts[i])
                        } else if (carts[i]["Type"] == 1) {
                            change1.push(carts[i])
                        } else {
                            change2.push(carts[i])
                        }
                    }
                    that.setData({
                        carts0: change0,
                        carts1: change1,
                        carts2: change2,
                        carts: res.data.data
                    })
                } else {
                    that.setData({
                        hiddenToast: false,
                        toastStr: '系统错误，请重试'
                    })
                }
            },
            fail: function (res) {
                console.log(res)
                that.setData({
                    hiddenToast: false,
                    toastStr: '系统错误，请重试'
                })
            }
        })
    },


    add: function (e) {
        this.extraLine.push('other line')
        this.setData({
            text: initData + '\n' + this.extraLine.join('\n')
        })
    },
    remove: function (e) {
        if (this.extraLine.length > 0) {
            this.extraLine.pop()
            this.setData({
                text: initData + '\n' + this.extraLine.join('\n')
            })
        }
    },
    tapName: function (e) {
      var that = this
      console.log(e.currentTarget.id)
      var id = e.currentTarget.id
      if (id == 0) {
        that.setData({
          carts: that.data.carts0
        })
      } else if (id == 1) {
        that.setData({
          carts: that.data.carts1
        })
      } else {
        that.setData({
          carts: that.data.carts2
        })
      }
      that.setData({
        selected: e.currentTarget.id
      })
    },

/*
    tapName: function (e) {
        var that = this
        var id = e.currentTarget.id
        var ss = ['0', '1', '2'];
        for (var i = 0; i < ss.length; i++) {
            var s = ss[i];
            if (s != id) {
                const ctx = wx.createCanvasContext(s);
                ctx.clearRect(0, 0, 50, 50);
                ctx.draw()
            }
        }

        var context = wx.createContext()
        context.moveTo(10, 5);//设置线条的起始路径坐标
        context.lineTo(70, 5);//设置线条的终点路径坐标
        context.stroke();//对当前路径进行描边
        wx.drawCanvas({
            canvasId: id,
            actions: context.getActions()
        })
        if (id == 0) {
            that.setData({
                carts: that.data.carts0
            })
        } else if (id == 1) {
            that.setData({
                carts: that.data.carts1
            })
        } else {
            that.setData({
                carts: that.data.carts2
            })
        }
    }
*/
})
