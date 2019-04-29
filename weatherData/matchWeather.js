
/*匹配天气图标以及颜色*/
import weatherList from './weather.js'

const match = function(name,fn){
  weatherList.forEach(item =>{
    if (item.list.indexOf(name) != -1){
      fn(item)
      return
    }
  })
}

// export default match

module.export = match