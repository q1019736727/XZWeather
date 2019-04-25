//index.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk; 
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
    this.getLocation()
  },
  // 微信获得经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        that.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 腾讯地图sdk获取当前地理位置
  getLocal: function (latitude, longitude) {
    let that = this;
    // let serverUrl = that.globalData.serverUrl
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(res);
        // let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        wx.showModal({
          title: '当前位置',
          content: res.result.address,
        })
        // console.log(province + '-----' + city);
        // that.setData({
        //   province: province,
        //   city: city,
        //   latitude: latitude,
        //   longitude: longitude
        // })
        wx.request({
          url: serverUrl + '/wx/ma/getAreaIdByAreaName?areaName=' + city,
          success(res) {
            //保存到缓存中
            let user = that.globalData.user
            user.cityId = res.data.areaId
            user.cityName = res.data.areaName

            that.globalData.user = user
            wx.setStorageSync('user', user)

          },
          fail(res) {
            console.log("/wx/ma/getAreaIdByAreaName", res.data)
          }
        })

      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
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
