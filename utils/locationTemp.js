import Request from './request.js'
const loactionTemp = {
  //获取位置
  getLocation(qqmapsdk){
    // 微信获得经纬度(然后用腾讯地图SDK反编译出地理位置)
    return new Promise((resolve,reject)=>{
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var latitude = res.latitude
          var longitude = res.longitude
          getLocal(latitude, longitude, qqmapsdk)
            .then(adress=>{
              resolve(adress)
            }).catch(error=>{
              reject(JSON.stringify(error))
            })
        },
        fail: function (res) {
          reject(JSON.stringify(res))
        }
      })
    })
  },
  //获取温度
  getTemp(addressName){
    return new Promise((resolve, reject) => {
      Request.currentWeather(addressName).then(res=>{
        resolve(res)
      }).catch(error=>{
        reject(error)
      })
    })
  },
}
// 腾讯地图sdk获取当前地理位置
const getLocal = function (latitude,longitude,qqmapsdk) {
  return new Promise((resolve,reject)=>{
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let ad_info = res.result.ad_info
        //将历史地址存入本地缓存中
        let localStorageArr = wx.getStorageSync('CITY_LIST') || []
        let addressName = ad_info.district || ad_info.city
        let index = localStorageArr.indexOf(addressName)
        if (index === -1){
          localStorageArr.push(addressName)
        }
        wx.setStorageSync('CITY_LIST', localStorageArr)
        //
        resolve(ad_info.district || ad_info.city)
      },
      fail: function (res) {
        reject(JSON.stringify(res))
      }
    });
  })
}
export default loactionTemp