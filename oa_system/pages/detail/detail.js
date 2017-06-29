Page({
    data: {
        stafflist: null,
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
        console.log("token:", token)
        


    }
})