// pages/query/query.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
Page({
  data: {
    advertising: [
      '../../img/weather/wbj1.png',
      '../../img/weather/wbj4.png'
    ],
    tachstrategy: '',
    strategy: [
      { num: '0', name: '最快捷模式' },
      { num: '1', name: '最经济模式' },
      { num: '2', name: '最少换乘模式' },
      { num: '3', name: '最少步行模式' },
      { num: '4', name: '不乘地铁模式' },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'queryLocatuin',
      success: function (res) {
        that.setData({
          queryLocatuin: res.data,
        })
        that.getNavBus();
      }
    })

  },

  // 公交策略
  getNavBus: function () {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    var origin = that.data.queryLocatuin.startLocation
    console.log(origin)
    myAmapFun.getTransitRoute({
      origin: that.data.queryLocatuin.startLocation,
      destination: that.data.queryLocatuin.endLocation,
      city: '太原市',
      success: function (data) {
        // console.log(data)
        if (data && data.transits) {
          var transits = data.transits;
          for (var i = 0; i < transits.length; i++) {
            var tranTime = transits[i].duration;
            // console.log(tranTime);    
            transits[i].tranTime  = that.formatSeconds(tranTime);
            // console.log(transits[i].tranTime);
            var segments = transits[i].segments;
            var departureStop = segments[0].bus.buslines[0].departure_stop.name;
            transits[i].departureStop = departureStop;
            var standNum = segments[0].bus.buslines[0].via_num;
            transits[i].standNum = standNum;
            console.log(departureStop)
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
                var name = segments[j].bus.buslines[0].name;
                var sname = name.replace(/\(.*\)$/g, "");   //用正则判断去掉()里的内容
                // console.log(sname)
                if (j !== 0) {
                  sname = '/' + sname;
                }
                transits[i].transport.push(sname);
              }
            }
          }
        }
        that.setData({
          transits: transits
        });

      },
      fail: function (info) {

      }
    })
  },
  // 秒转时分秒
  formatSeconds: function (value) {
    var that = this;
    var theTime = parseInt(value);// 秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    // console.log(theTime); 
    if (theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      // alert(theTime1+"-"+theTime); 
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60);
      }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
      result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + "小时" + result;
    }
    console.log(result); 
    return result;
    
  }
})