
var Api = require('./api.js')

//获取code
var getCode = function(callback) {
  wx.login({
    success: function(res){
      if(res.code) {
        console.log('syslogin: ', res)
        typeof callback === "function" && callback(res.code)
        wx.request({
          url:'https://cephcp.ztgame.com.cn/sign/login',
          method:"POST",
          data:"code="+res.code,
          header:{
            "Content-Type":"application/x-www-form-urlencoded"
          },
          success: function(res){
            console.log(res.data)
            
          }

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
  getCode((code) => {
    wx.getUserInfo({
      success: function(res){
        console.log('用户允许授权')
        wx.request({
          url: Api.session,
          data: {
            code: code,
            newteo: 'b1efdafd3bbec0b7251c755859d6d9e5f073263c',
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          method: 'GET',
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
