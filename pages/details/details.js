// pages/details/details.js
var app = getApp();
Page({
  data: {
    details: false,      //是否显示全部公交站点名称默认不显示

  },
  //点击切换显示全部站点
  details:function(e){
    var that = this;
    // console.log(e)
    var details = that.data.details;
    that.setData({
      details: (!that.data.details)
    })
  },
  decon:function(e){
    
    var that = this;
    var num = e.detail.current;
    console.log(num);
    that.getBusNum(num);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1111111111)
    console.log(options.busNum)
    var that = this;
    var transits = app.globalData.transits; //获取全局的所以乘车线路
    var busNum = options.busNum
    that.setData({
      transits: transits,
      busNum: busNum,
    })
    that.getBusNum(busNum);
     
  },
  // 获取是第几个乘车线路
  getBusNum:function(num){
    var that = this;
    var transits = app.globalData.transits; //获取全局里的所有乘车线路
    console.log(transits)
    var busNum = num;
    console.log(busNum)
    var circuit = transits[busNum]  //获取当前的乘车线路的详细信息
    console.log(circuit);
    var segments = circuit.segments   //获取所有换乘路段列表
    for (var i = 0; i < segments.length; i++){
      // segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name
      // console.log(segments[i].walking.steps)
      var steps = segments[i].walking.steps;  //什么该导航路段的数组方便下面遍历
      var walk = segments[i].walking.steps[steps.length-1].instruction;
      // console.log(walk);
      segments[i].describe = walk   //往数组里添加解析好的步行的数据
      if (segments[i].bus.buslines[0] != undefined){  //判断如果不等于undefined就往数组里添加解析后的线路数据
        var departureStop = segments[i].bus.buslines[0].departure_stop.name;  //声明此段起乘站
        segments[i].departureStop = departureStop;  //将此段起乘站放入数组里
        var arrivalStop = segments[i].bus.buslines[0].arrival_stop.name;  //声明此段下车站
        // console.log(arrivalStop)
        segments[i].arrivalStop = arrivalStop;  //将此段下车站放入数组里
        var viaNum = segments[i].bus.buslines[0].via_num; // 声明此段途经公交站数
        // console.log(viaNum)
        segments[i].viaNum = viaNum   //将此段途经公交站数放入数组里
        var viaStopsName = [];    //声明一个此段途经公交站点列表名称的数组
        var viaStops = segments[i].bus.buslines[0].via_stops;   //找到数组里面公交站点是数组准备循环找name
        for (var v = 0; v < viaStops.length;v++){          
          console.log(viaStops[v].name);
          viaStopsName.push(viaStops[v].name);  //往数组的末尾添加一个或多个元素{push}
          console.log(viaStopsName)
        }
        segments[i].viaStops = viaStopsName;  //将途经的公交站名称放入新的数组里
        
      }
      //开始判断起点终点的名称
      circuit.site = [];
      for (var j = 0; j < segments.length; j++) {
        if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
          var name = segments[j].bus.buslines[0].name;
          
          // console.log(sname)
          if (j !== 0) {
            name = name;
          }
          circuit.site.push(name);
        }
      }
      // console.log(sbusline);
    }
   
    that.setData({
      circuit: circuit,
    })
  }
  
})