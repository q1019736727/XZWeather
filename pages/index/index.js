//index.js
//获取应用实例
const app = getApp()
import loactionTemp from '../../utils/locationTemp.js'
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let qqmapsdk; 
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    addressName:'',
    temperature:'',
    currentWeatherList:[],
    currentWeather:{}
  },
  //事件处理函数
  bindViewTap: function() {
   
  },
  onLoad: function () {
    // 腾讯地图实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FVSBZ-SKL32-SSGUE-CTC7S-KELNE-43FKU'
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    //获取位置和天气情况
    loactionTemp.getLocation(qqmapsdk).then(addressName=>{
      loactionTemp.getTemp(addressName).then(res=>{
        console.log(res)
        this.setData({
          currentWeatherList:res.data.data,
          currentWeather:res.data.data[0]
        })
      })
      this.setData({
        addressName
      })
    })
    const context = wx.createCanvasContext('tempratureCanvas')

    context.setStrokeStyle('#00ff00')
    context.setLineWidth(5)
    context.rect(0, 0, 200, 200)
    context.stroke()
    context.setStrokeStyle('#ff0000')
    context.setLineWidth(2)
    context.moveTo(160, 100)
    context.arc(100, 100, 60, 0, 2 * Math.PI, true)
    context.moveTo(140, 100)
    context.arc(100, 100, 40, 0, Math.PI, false)
    context.moveTo(85, 80)
    context.arc(80, 80, 5, 0, 2 * Math.PI, true)
    context.moveTo(125, 80)
    context.arc(120, 80, 5, 0, 2 * Math.PI, true)
    context.stroke()
    context.draw()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
