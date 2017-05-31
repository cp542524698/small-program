
var Api = require('./api.js')

//获取code
var getCode = function(callback) {
  wx.login({
    success: function(res){
      if(res.code) {
        console.log('syslogin: ', res)
        console.log('request id:', res.code)
        typeof callback === "function" && callback(res.code)
      }
      else {
        console.log('获取code失败！' + res.errMsg)
      }
    }
  })
}

// 获取access_token
function getToken (callback) {
  getCode((code) => {
    wx.getUserInfo({
      success: function(res){
        console.log('用户允许授权')
        var request = "code=" + code
        wx.request({
          url: Api.session,
          data: {
            code: request,
          },
          method: 'GET',
          header:{
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res){
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
