//index.js
//获取应用实例
var app = getApp()
console.log(app.appName)

Page({
    data: {
       send00: 'http://222.73.196.82:9999/send_index.png',
       carts:[
          {
              //http://222.73.196.82:9999/flower_01.jpg
              image:'http://222.73.196.82:9999/flower_01.jpg', 
              desc:"触摸,薰衣草礼盒", 
              count:'1000', 
              price:"188.0" 
          },
          {
              image:'http://222.73.196.82:9999/flower_02.jpg', 
              desc:"十二星座经典七彩·摩羯座",
              count:'1000', 
              price:"188.0" 
          },
          {
              image:'http://222.73.196.82:9999/flower_03.jpg', 
              desc:"甜蜜物语",
              count:'1000', 
              price:"188.0" 
          },
          {
              //http://222.73.196.82:9999/flower_04.jpg
              image:'http://222.73.196.82:9999/flower_04.jpg', 
              desc:"芍药",
              count:'1000', 
              price:"188.0" 
          },
          {
              image:'http://222.73.196.82:9999/flower_05.jpg', 
              desc:"绣球",
              count:'1000', 
              price:"188.0" 
          },
          {
              image:'http://222.73.196.82:9999/flower_06.jpg', 
              desc:"爱在巴黎",
              count:'1000', 
              price:"188.0" 
          },
          {
              image:'http://222.73.196.82:9999/flower_07.jpg', 
              desc:"佳期如梦",
              count:'1000', 
              price:"188.0" 
          },
        ] 
    }

})