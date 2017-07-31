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
  getLocation: function () {
    var that = this;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data[0].regeocodeData.addressComponent.city)
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,

        }]
        that.setData({
          markers: marker,
          // latitude: data[0].latitude,
          // longitude: data[0].longitude,
          startLocation: data[0].latitude + ',' + data[0].longitude,
          startPlaceVal: data[0].name,
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        });

        wx.setStorage({
          key: "city",
          data: data[0].regeocodeData.addressComponent.city
        })
      },
      fail: function (info) {
        // wx.showModal({title:info.errMsg})
      }
    })
  },
  //设置input值
  setInputVal: function (e) {
    var text = e.currentTarget.dataset.text,    //获取输入提示框内容
      inputClass = e.currentTarget.dataset.inputClass,    //判断他是出发地还是目的地
      i = e.currentTarget.dataset.index,    //获取输入提示框点击的data-index
      that = this;
    if (inputClass == "start_place") {
      console.log(e)
      var startlocation = that.data.hotWordLocation[i]; //查找到当前点击的输入提示框的坐标

      that.setData({
        startPlaceVal: text,
        startLocation: startlocation,
        hotWord0: false
      });

    } else if (inputClass == "end_place") {
      var endLocation = that.data.hotWordLocation[i]; //查找到当前点击的输入提示框的坐标
      that.setData({
        endPlaceVal: text,
        endLocation: endLocation,
        hotWord1: false
      });

    }
  },
  //热词搜索
  bindInput: function (e) {
    //获取当前input框的val值
    var value = e.detail.value;
    //获取当前input框的下标值值
    var curIndex = e.currentTarget.dataset.className;
    this.hotWordsSearch(value, curIndex)
  },
  bindKeyInput: function (e) {
    //获取当前input框的val值
    var value = e.detail.value;
    //获取当前input框的下标值值
    var curIndex = e.currentTarget.dataset.className;
    this.hotWordsSearch(value, curIndex)
  },
  hotWordsSearch: function (val, curTag) {
    var that = this;
    var keywords = val;
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    myAmapFun.getInputtips({
      keywords: keywords,
      city: '太原市',
      success: function (data) {
        if (data && data.tips) {
          var sugData = [], sugDataLocation = [], resuNum = data.tips.length;
          if (resuNum > 0) {
            //获取搜索结果
            for (var i = 0; i < data.tips.length; i++) {
              sugData[i] = data.tips[i].name;
              sugDataLocation[i] = data.tips[i].location;
            }
            //判断是哪个框的搜索结果
            if (curTag == "hot_word0") {
              that.setData({
                hotWord0: true,
                hotWordArr0: sugData,
                hotWordLocation: sugDataLocation,
              });
            } else if (curTag == "hot_word1") {
              that.setData({
                hotWord1: true,
                hotWordArr1: sugData,
                hotWordLocation: sugDataLocation,
              });
            }
          } else {
            //判断是哪个框的搜索结果
            if (curTag == "hot_word0") {
              that.setData({
                hotWord0: false
              });
            } else if (curTag == "hot_word1") {
              that.setData({
                hotWord1: false
              });
            }
          }
        }
      }
    })
  },
  // 点击查询跳页面
  bindSearch: function () {
    var that = this,
      startLocation = that.data.startLocation,
      endLocation = that.data.endLocation;
    // var queryLocatuin = [startLocation, endLocation];    //获取成数组
    var queryLocatuin = {   //获取成对象
      startLocation: startLocation,
      endLocation: endLocation
    };
    //把值存入本地
    wx.setStorage({
      key: "queryLocatuin",
      data: queryLocatuin
    })
    // console.log(queryLocatuin)
    wx.navigateTo({
      url: '../query/query'
    })
  }

})
