// pages/details/details.js
var app = getApp();
Page({
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var transits = app.globalData.transits;
    that.setData({
      transits: transits,
    })
    that.getBusNum(0);
     
  },
  // 获取是第几个乘车线路
  getBusNum:function(num){
    var that = this;
    var transits = app.globalData.transits; //获取全局里的所有乘车线路
    
    var busNum = num;
    
    var circuit = transits[busNum]  //获取当前的乘车线路的详细信息
    console.log(circuit);
    var segments = circuit.segments   //获取所有换乘路段列表
    for (var i = 0; i < segments.length; i++){
      var walk = segments[i].walking.steps.pop().instruction;
      console.log(walk);
      segments[i].describe = walk   //往数组里添加解析好的步行的数据
      if (segments[i].bus.buslines[0] != undefined){  //判断如果不等于undefined就往数组里添加解析后的线路数据
        var departureStop = segments[i].bus.buslines[0].departure_stop.name;  //声明此段起乘站
        segments[i].departureStop = departureStop;  //放入数组里
        var arrivalStop = segments[i].bus.buslines[0].arrival_stop.name;  //声明此段下车站
        segments[i].arrivalStop = arrivalStop;  //放入数组里
      }
      
      // console.log(sbusline);
    }
    // var walking = circuit.segments[0].walking.steps.pop().instruction;
   
    that.setData({
      transits: transits,
    })
  }
  
})