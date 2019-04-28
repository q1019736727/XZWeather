const DrawK = function (canvasWidth, tempData){
  let tempArr = tempData.hours.map((data)=>{
    let temp = data.tem.replace('℃','')
    return temp
  })
  //最多只取6个数
  tempArr = tempArr.splice(0,6)
  //间距
  let spaceWid = (canvasWidth - 80) / (tempArr.length - 1)

  const ctx = wx.createCanvasContext('canvas')
  ctx.setStrokeStyle('#ec990c')

  for (let i = 0; i < tempArr.length; i++) {
    drawSection(ctx, {
      x: 40 + spaceWid * i,
      y: calcTemp(tempArr[i], tempArr) + 20 //预留出20个像素让上面温度显示
    }, {
        x: 40 + spaceWid * (i + 1),
        y: calcTemp(tempArr[i + 1], tempArr) + 20
      }, i, tempArr);
  }
  ctx.draw()
}
const drawSection = function (ctx, currentPoint, nextPoint, currentIndex, tempList){
  let [x1, y1] = [currentPoint.x, currentPoint.y]
  let [x2, y2] = [nextPoint.x, nextPoint.y]
  //最高温度
  ctx.beginPath();
  ctx.setShadow(0, 0, 0, '#fff')
  ctx.setFontSize(11)
  ctx.setFillStyle('#7971e9')
  ctx.fillText(tempList[currentIndex], x1 - 5, y1 - 10)
  ctx.stroke();
  //小点
  ctx.beginPath();
  ctx.setLineWidth(3)
  ctx.setShadow(0, 3, 3, '#ddd')
  ctx.moveTo(x1, y1)
  ctx.arc(x1, y1, 1, 0, Math.PI * 2, true)
  ctx.stroke();
  //线条
  ctx.beginPath();
  ctx.moveTo(x1, y1)
  ctx.setLineWidth(1)
  if (currentIndex === tempList.length - 1) {
    ctx.stroke()
    return
  }
  if (x2) {
    ctx.lineTo(x2, y2)
  }
  ctx.stroke(); //一个图形绘画完毕
}
const calcTemp = function(temp,tempList) {
  //这里先找出最大与最小温度,然后平分50像素确定位置
  let sortArr = quickSort(JSON.parse(JSON.stringify(tempList)))
  let tempDiff = sortArr[sortArr.length - 1] - sortArr[0]
  let averageSpace = 50 / tempDiff
  let pointY = 50 - (temp - sortArr[0]) * averageSpace
  if (isNaN(pointY)) {
    return 25
  }
  return pointY
}
const quickSort = function(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) { //前面的数据比后面的大就交换位置
        var list = arr[i];
        arr[i] = arr[j];
        arr[j] = list;
      }
    }
  }
  return arr;
}
export default DrawK