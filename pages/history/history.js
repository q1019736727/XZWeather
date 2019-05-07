// pages/history/history.js
Page({
  data: {
    cityList: null,
    preAddressName:''
  },
  onLoad: function (options) {
    this.setData({
      cityList: wx.getStorageSync('CITY_LIST'),
      preAddressName: options.addressName
    })
  },
  clickAddress(optional){
    let index = optional.target.dataset.index
    wx.reLaunch({
      url: `../index/index?addressName=${this.data.cityList[index]}`,
    })
  }
})