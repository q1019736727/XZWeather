// pages/history/history.js
Page({
  data: {
    cityList: null
  },
  onLoad: function (options) {

    this.setData({
      cityList:wx.getStorageSync('CITY_LIST')
    })
  },

})