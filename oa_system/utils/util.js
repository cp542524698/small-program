var Api = require('./api.js')
var app = getApp()

//获取code
var getCode = function(callback) {
  wx.login({
    success: function(res){
      if(res.code) {
        console.log('syslogin: ', res)
        var nickname =""  
        var imgurl = "" 
        app.getUserInfo(function (userInfo) {
          console.log("user info:", userInfo)
          nickname = userInfo.nickName
          imgurl = userInfo.avatarUrl
          typeof callback === "function" && callback(res.code, nickname, imgurl)
        })    
      }
      else {
        console.log('获取code失败！' + res.errMsg)
      }
    }
  })
}

// 获取access_token
function getToken (callback) {
  getCode((code, nickname, imgurl) => {
    wx.getUserInfo({
      success: function(res){
        console.log('用户允许授权', nickname)
        //var request = "code=" + code
        wx.request({
          url: Api.session,
          data: {
            code: code,
            nickname: nickname,
            imgurl: imgurl,
          },
          method: 'GET',
          header:{
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res){
            console.log(res)
            typeof callback == "function" && callback(res.data)
          },
          fail: function() {
            console.log('wx.request 请求失败')
          }
        })
      },
      fail: function(res) {
        if(res.errMsg) {
          console.log('用户拒绝授权', res)
          typeof callback == "function" && callback({errMsg : "userDenyed"})
        }
      }
    })
  })
}


module.exports = {
  getToken: getToken
}
