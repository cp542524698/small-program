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
                name: "创意盆栽"
            },
            {
                name: "种子售卖"
            }, {
                name: "园艺工具"
            }
        ],
        carts: [],
        potting: [],
        seed: [],
        tools: [],
        selected: -1
    },
    //设置分享
    onShareAppMessage: function () {
        return {
            title: '稣予的花园',
            desc: '最具人气的花草聚集地',
            path: '/page/gardening?id=123'
        }
    },
    jumpbuy: function (event) {
        console.log(event)
        wx.navigateTo({
            url: '../shopping/shopping?id=' + event.currentTarget.id
        })
    },

    onLoad: function (event) {
        var that = this
        //data1 = {"id": 0}
        wx.request({
            url: "https://cephcp.ztgame.com.cn/getinfo",
            data: "goodsType=1",
            method: "POST",
            header: {
                //"Content-Type":"application/json"
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res.data)
                /*
                try {
                    wx.setStorageSync('personal', 'res.data')
                }catch(e){
                    console.log("setStorageSync error")    
                }*/
                var type1 = []
                var type2 = []
                var type3 = []
                for (var i = 0; i < res.data.data.length; i++) {
                    if (res.data.data[i].Type == "0") {
                        type1.push(res.data.data[i])
                    } else if (res.data.data[i].Type == "1") {
                        type2.push(res.data.data[i])
                    } else {
                        type3.push(res.data.data[i])
                    }
                }
                that.setData({ potting: type1 })
                that.setData({ seed: type2 })
                that.setData({ tools: type3 })
                that.setData({ carts: res.data.data })
            },
            fail: function (err) {
                console.log(err)
            }
        })
    },


    extraLine: [],
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

    tapName: function(e){
      var that= this
      console.log(e.currentTarget.id)
      var id= e.currentTarget.id
      if (id == 0) {
        that.setData({
          carts: that.data.potting
        })
      } else if (id == 1) {
        that.setData({
          carts: that.data.seed
        })
      } else if (id == 2) {
        that.setData({
          carts: that.data.tools
        })
      }
      that.setData({
        selected: e.currentTarget.id
      })
    }
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
                carts: that.data.potting
            })
        } else if (id == 1) {
            that.setData({
                carts: that.data.seed
            })
        } else if (id == 2) {
            that.setData({
                carts: that.data.tools
            })
        }
    }*/
})


/*
//通过page()函数来注册页面
Page({
  data: {
    motto: 'Hello World',
    imageArray:[
      '/page/image/index_01.png',
      '/page/image/index_02.png'
    ]

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

 tapName: function(event) {
    console.log(event)
  },

  test: function(event) { 
    console.log(event)
    console.log(this.data.imageUrls[this.data.current])


    console.log(event.target.id)
  
  var myimg=document.getElementById("imgs"); 
    myimg.src="/image/index_02.png";
    var array= new Array("/image/index_01.png","/image/index_02.png");         
    
    if(index==array.length-1){ 
      index=0; 
    }else{ 
      index++; 
    } 
  
    myimg.src=array[index]; 
  }
})
*/
