var app = getApp()
console.log(app.appName)

Page({
    data: {
        carts: [],
        minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
        selectedAllStatus: false,
        toastHidden: true,
        total: '',
        baseurl: "https://cephcp.ztgame.com.cn/flower_",
        showView: true,
        showView2: true,
        name: '_________________________',
        address: '_________________________',
        tel: '_________________________',
        delid: -1,
    },
    //事件处理函数
    onLoad: function () {
        this.sum();
        var that = this
        var session
        try {
            session = wx.getStorageSync('session')
        } catch (e) {
            console.log("getStorageSync error")
        }
        if (session) {
            var data = "session=" + session
            console.log(data)
            console.log("============")
            wx.request({
                url: "https://cephcp.ztgame.com.cn//shoppingcarshow",
                data: data,
                method: "POST",
                header: {
                    //"Content-Type":"application/json"
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.Code == 403) {
                        that.setData({
                            toastHidden: false,
                            toastStr: "请先登录哦"
                        });
                    } else if (res.data.Code == 200) {
                        if (res.data.data.length>1){
                        that.setData({
                            carts: res.data.data
                        })
                        }else{
                            that.setData({
                                carts: res.data.data,
                                toastHidden: false,
                                toastStr:"购物车空空如也"
                            })
                        }

                    } else {
                        that.setData({
                            toastHidden: false,
                            toastStr: "系统出错啦...请重试"
                        });
                    }
                },
                fail: function (err) {
                    console.log(err)
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
                toastHidden: false,
                toastStr: '请先登录'
            })
        }
    },

    formSubmit: function (e) {
        var that = this
        var name = that.data.name
        var tel = that.data.tel
        var address = that.data.address
        if (name.indexOf("____") > 0) {
            name = e.detail.value.name;
        }

        if (tel.indexOf("____") > 0) {
            tel = e.detail.value.tel;
        }
        if (address.indexOf("___") > 0) {
            address = e.detail.value.address;
        }
        if (that.data.total == "￥0") {
            that.setData({
                toastHidden: false,
                toastStr: '还没选中所需要购买商品哦，亲'
            })
            return false;
        }

        if (tel != null && name != null && address != null) {
            var length = tel.length;
            console.log(tel)
            console.log(tel.length)
            if (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(tel)) {
                try {
                    wx.setStorage({
                        key: 'username',
                        data: name,
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

                try {
                    wx.setStorage({
                        key: 'tel',
                        data: tel,
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
                try {
                    wx.setStorage({
                        key: 'address',
                        data: address,
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
                    showView: true,
                    name: name,
                    address: address,
                    tel: tel,
                })

                var all = [];
                var selected_index = []
                // 遍历取出已勾选的cid
                for (var i = 0; i < this.data.carts.length; i++) {
                    var gooddes = {}
                    if (this.data.carts[i].selected) {
                        selected_index.push(i)
                        gooddes['id'] = this.data.carts[i].Goodid;
                        gooddes['name'] = this.data.carts[i].Name;
                        gooddes['price'] = this.data.carts[i].Price;
                        gooddes['many'] = this.data.carts[i].Many;
                        all.push(gooddes)
                    }
                }

                var session
                try {
                    session = wx.getStorageSync('session')
                } catch (e) {
                    console.log("getStorageSync error")
                    that.setData({
                        toastHidden: false,
                        toastStr: "抱歉，系统出错啦..."
                    });
                }
                var orderinfo = {}
                orderinfo['tel'] = tel
                orderinfo['name'] = name
                orderinfo['address'] = address

                var timeStamp, nonceStr, pack, signType, paysign
                if (session) {
                    console.log("===================支付预请求=============")
                    var content = "session=" + session + "&detail=" + JSON.stringify(all) + "&orderinfo=" + JSON.stringify(orderinfo) + "&fee=" + that.data.total.substring(1)
                    console.log(content)
                    //1、向后端发送预付款请求，获取prepray_id,并返回
                    wx.request({
                        url: "https://cephcp.ztgame.com.cn/prepay",
                        data: content,
                        method: "POST",
                        header: {
                            //"Content-Type":"application/json"
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        success: function (res) {
                            console.log(res)
                            if (res.data.Code == 200) {
                                timeStamp = res.data.data["TimeStamp"]
                                nonceStr = res.data.data["NonceStr"]
                                pack = res.data.data["Package"]
                                signType = res.data.data["SignType"]
                                paysign = res.data.data["PaySign"]

                                //2、调用wx.requestPayment,小程序端支付
                                console.log(timeStamp)
                                console.log(nonceStr)
                                console.log(pack)
                                console.log(paysign)
                                if (!timeStamp || !nonceStr || !pack || !signType || !paysign) {
                                    that.setData({
                                        toastHidden: false,
                                        toastStr: "抱歉，系统出错啦...请重试"
                                    });
                                    return false;
                                }
                                wx.requestPayment({
                                    timeStamp: timeStamp,
                                    nonceStr: nonceStr,
                                    package: pack,
                                    signType: signType,
                                    paySign: paysign,
                                    success: function (res) {
                                        // success
                                        console.log(res)
                                        console.log("--------支付成功")
                                        var carts = that.data.carts;
                                        var del_arr = []
                                        for (var i = 0; i < selected_index.length; i++) {
                                            del_arr.push(carts[selected_index[i]]["Goodid"])
                                            carts.splice(selected_index[i], 1)
                                        }

                                        wx.request({
                                            url: "https://cephcp.ztgame.com.cn/delgoodsall",
                                            data: "session=" + session + "&goodIds=" + JSON.stringify(del_arr) + "&many=0",
                                            method: "POST",
                                            header: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            success: function (res) {
                                                console.log(res)
                                            },
                                            fail: function (err) {
                                                console.log(err)
                                            }
                                        })

                                        this.setData({
                                            carts: carts,
                                            toastHidden: false,
                                            toastStr: "支付成功"
                                        })
                                        console.log(res)
                                    },
                                    fail: function (res) {
                                        // fail
                                        console.log("-------dff-支付成功")
                                        console.log(res)
                                        that.setData({
                                            toastHidden: false,
                                            toastStr: "支付失败"
                                        })
                                    },
                                    complete: function (res) {
                                        // complete
                                    }
                                })
                            } else if (res.data.Code == 403) {
                                that.setData({
                                    toastHidden: false,
                                    toastStr: "登录超时，请重新登录哦"
                                });
                            } else {
                                that.setData({
                                    toastHidden: false,
                                    toastStr: "抱歉，系统出错啦...请重试"
                                });
                            }
                            console.log("支付与请求成功返回")
                        },
                        fail: function (res) {
                            that.setData({
                                toastHidden: false,
                                toastStr: "抱歉，系统出错啦...请重试"
                            });
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
                    this.setData({
                        toastHidden: false,
                        toastStr: "请重新登录"
                    });
                }
            } else {
                that.setData({
                    toastHidden: false,
                    toastStr: '手机号码输入有误,请重新输入',
                    showView: true,
                })
            }
        } else {
            that.setData({
                toastHidden: false,
                toastStr: '订单信息有误,请重新输入',
                showView: true,
            })
        }
    },
    /*
        bindMinus: function (e) {
            var index = parseInt(e.currentTarget.dataset.index);
            var num = this.data.carts[index].Many;
            // 如果只有1件了，就不允许再减了
            if (num > 1) {
                num--;
            }
            // 只有大于一件的时候，才能normal状态，否则disable状态
            var minusStatus = num <= 1 ? 'disabled' : 'normal';
            // 购物车数据
            var carts = this.data.carts;
            carts[index].Many = num;
            // 按钮可用状态
            var minusStatuses = this.data.minusStatuses;
            minusStatuses[index] = minusStatus;
            // 将数值与状态写回
            this.setData({
                carts: carts,
                minusStatuses: minusStatuses
            });
            this.sum();
        },*/
    sureDel: function (e) {
        var carts = this.data.carts;
        var index = this.data.delid;
        var id = this.data.carts[index]['Goodid'];
        carts.splice(index, 1)
        this.setData({
            showView2: true,
            carts: carts,
            delid: -1,
        })
        var session
        try {
            session = wx.getStorageSync('session')
        } catch (e) {
            console.log("getStorageSync error")
            this.setData({
                toastHidden: false,
                toastStr: "抱歉，系统出错啦..."
            });
        }
        if (session) {
            wx.request({
                url: "https://cephcp.ztgame.com.cn/delgoods",
                data: "session=" + session + "&goodId=" + id + "&many=0",
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    console.log(res)
                },
                fail: function (err) {
                    console.log(err)
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
            this.setData({
                toastHidden: false,
                toastStr: "登录超时，请重新登录哦"
            });
        }
    },

    Del: function (e) {
        this.setData({
            showView2: true
        })
    },

    bindMinus: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var num = this.data.carts[index].Many;
        if (num == 1) {
            this.setData({
                delid: index,
                showView2: false
            })
        } else {
            num--
            var carts = this.data.carts;
            carts[index].Many = num;
            this.setData({
                carts: carts,
            })
        }
    },
    bindPlus: function (e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var num = this.data.carts[index].Many;
        // 自增
        num++;
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 购物车数据
        var carts = this.data.carts;
        carts[index].Many = num;
        // 按钮可用状态
        var minusStatuses = this.data.minusStatuses;
        minusStatuses[index] = minusStatus;
        // 将数值与状态写回
        this.setData({
            carts: carts,
            minusStatuses: minusStatuses
        });
        this.sum();
    },
    bindCheckbox: function (e) {
        /*绑定点击事件，将checkbox样式改变为选中与非选中*/
        //拿到下标值，以在carts作遍历指示用
        var index = parseInt(e.currentTarget.dataset.index);
        //原始的icon状态
        var selected = this.data.carts[index].selected;
        var carts = this.data.carts;
        // 对勾选状态取反
        carts[index].selected = !selected;
        // 写回经点击修改后的数组
        this.setData({
            carts: carts
        });
        this.sum();
    },
    bindSelectAll: function () {
        // 环境中目前已选状态
        var selectedAllStatus = this.data.selectedAllStatus;
        // 取反操作
        selectedAllStatus = !selectedAllStatus;
        // 购物车数据，关键是处理selected值
        var carts = this.data.carts;
        // 遍历
        for (var i = 0; i < carts.length; i++) {
            carts[i].selected = selectedAllStatus;
        }
        this.setData({
            selectedAllStatus: selectedAllStatus,
            carts: carts
        });
        this.sum();
    },

    bindCheckout: function () {
        var that = this
        var name, tel, address
        if (that.data.total == "￥0") {
            that.setData({
                toastHidden: false,
                toastStr: '还没选中所需要购买的商品哦，亲'
            })
        } else {
            try {
                name = wx.getStorageSync('username')
                tel = wx.getStorageSync('tel')
                address = wx.getStorageSync('address')
            } catch (e) {
                console.log("getStorageSync error")
                this.setData({
                    toastHidden: false,
                    toastStr: "抱歉，系统出错啦..."
                });
            }
            if (name && tel && address) {
                that.setData({
                    name: name,
                    tel: tel,
                    address: address
                })
            }
            that.setData({
                showView: false
            })
        }
    },

    bindToastChange: function () {
        this.setData({
            toastHidden: true
        });
    },
    sum: function () {
        var carts = this.data.carts;
        // 计算总金额
        var total1 = 0;
        for (var i = 0; i < carts.length; i++) {
            if (carts[i].selected) {
                total1 += carts[i].Many * carts[i].Price;
            }
        }
        // 写回经点击修改后的数组
        this.setData({
            carts: carts,
            total: '￥' + total1
        });
    }

})
