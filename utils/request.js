const weatherUrl = 'https://www.tianqiapi.com/api/?version=v1'
const app_secret = 'wGz6LaLr'
const app_id = '44198862'
const Request = {
  currentWeather(addressName){
    addressName = (addressName + '').substring(0, addressName.length-1)
    return new Promise((resolve,reject)=>{
      wx.request({
        url: weatherUrl,
        method: 'get',
        data: { city: addressName, appid: app_id, appsecret: app_secret },
        success: (res) => {
          resolve(res)
        },
        fail: (error) => {
          reject(JSON.stringify(error))
        }
      })
    })
  }
}

export default Request