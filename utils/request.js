const weatherUrl = 'https://www.tianqiapi.com/api/?version=v1'

const Request = {
  currentWeather(addressName){
    addressName = (addressName + '').substring(0, addressName.length-1)
    return new Promise((resolve,reject)=>{
      wx.request({
        url: weatherUrl,
        method: 'get',
        data: { city: addressName },
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