//index.js
//获取应用实例
import drawK from '../../tools/draw.js'
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
    addressName: '',
    temperature: '',
    currentWeatherList: null,
    currentWeather: null,
    currentTimeList: [],
    guideList:[],
    isLoading: false, //是否在获取位置
    isShowLocation:false
  },
  //事件处理函数
  bindViewTap: function() {

  },
  onLoad: function(options) {
    getApp().setWatcher(this.data, this.watch); // 设置监听器
    // 腾讯地图实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FVSBZ-SKL32-SSGUE-CTC7S-KELNE-43FKU'
    });
    if (options.addressName){
      this.getAddressWeather(options.addressName)
    }else{
      this.getAddressName()
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  cliclRefresh: function() {
    if (!this.data.isLoading) {
      this.getAddressName()
    }
  },
  goCityList: function() {
    wx.navigateTo({
      url: `../history/history?addressName=${this.data.addressName}`,
    })
  },
  //获取定位地址天气信息
  getAddressName() {
    this.setData({
      isLoading: true
    })
    //获取位置和天气情况
    loactionTemp.getLocation(qqmapsdk).then(addressName => {
      this.getAddressWeather(addressName)
    }).catch(error=>{
      this.setData({
        isShowLocation: true
      })
    })
  },
  //获取指定位置天气信息
  getAddressWeather(addressName){
    loactionTemp.getTemp(addressName).then(res => {
      console.log(res)
      this.setData({
        isLoading: false
      })
      let timeL = (res.data.data[0]).hours.map(res => {
        let time = res.day.slice(3, 6)
        return time
      })
      timeL = timeL.splice(0, 6)
      this.setData({
        currentWeatherList: res.data.data,
        currentWeather: res.data.data[0],
        guideList: (res.data.data[0]).index,
        currentTimeList: timeL,
        isShowLocation: false
      })
    })
    this.setData({
      addressName
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //监听数据变化
  watch: {
    currentWeather: function(newValue) {
      const query = wx.createSelectorQuery()
      query.select('#canvas').boundingClientRect(function(res) {
        //绘制温度K线图
        drawK(res.width, newValue)
      }).exec()
    }
  }
})