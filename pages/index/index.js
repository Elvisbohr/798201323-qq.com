//index.js
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
//获取应用实例
var app = getApp()
Page({
  data: {
		weather: {} //获取天气信息
  },

  onLoad: function () {
  	 var that = this;
     this.getWeather();
     this.getLocation();
  },
  
  //获取天气信息
  getWeather: function () {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: 'e5b8d233f64bd67976a768adfdb149a0' });
    myAmapFun.getWeather({
      success: function (data) {
        console.log(data)
        var weather = data,
          allWeather = app.globalData.allWeather;
        for (var i = 0; i < allWeather.length; i++) {
          if (weather.liveData.weather == allWeather[i]) {
            weather.liveData["weaImg"] = "../../img/weather/w" + (i + 1) + ".png";
            that.setData({
              weather: weather,
              weatherShow: false
            })
          }
        }
        //更改图标
      },
      fail: function (info) {
        wx.showModal({ title: info.errMsg })
      }
    })
  },
  //获取当前位置
  getLocation:function(){
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data)
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          
        }]
        that.setData({
          markers: marker,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          startPlaceVal: data[0].name,
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        });
        
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })
  },
  //设置input值
  setInputVal: function (e) {
    var text = e.currentTarget.dataset.text,
      inputClass = e.currentTarget.dataset.inputClass,
      that = this;
    if (inputClass == "start_place") {
      that.setData({
        startPlaceVal: text,
        hotWord0: false
      });
    } else if (inputClass == "end_place") {
      that.setData({
        endPlaceVal: text,
        hotWord1: false
      });
    }
  },
  //热词搜索
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips,
              hotWord0: true,           
          });
        }
      }
    })
  },
})
