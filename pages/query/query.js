// pages/query/query.js
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var config = require('../../libs/config.js');
var app = getApp();
Page({
  data: {
    advertising: [
      { url: app.globalData.serverAddress + '/jws/upload/ccgj/5566.gif', toform: 'wxfc5733e5e843b64a' },
      // { url: app.globalData.serverAddress +'/jws/upload/ccgj/wbj4.png', toform:'wxfc5733e5e843b64a'}, 
    ],
    tachstrategy: '',
    tapStrategy:'最快捷模式',
    strategy: [
      { num: '0', name: '最快捷模式', upjt:true, },
      { num: '1', name: '最经济模式', upjt: false,},
      { num: '2', name: '最少换乘模式', upjt: false,},
      { num: '3', name: '最少步行模式', upjt: false,},
      { num: '4', name: '不乘地铁模式', upjt: false, },

    ],
    pathList: false, //其他公交换乘策略
    upjt:false,
    bindStrategy: 0, //默认公交换乘策略为 "0：最快捷模式"
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
  //点击跳转到其他小程序
  advertis:function(e){
    // console.log(e.currentTarget.dataset.index)
    var that = this;
    var advertising = that.data.advertising;
    console.log(advertising)    
    var num = e.currentTarget.dataset.index;
    console.log(num)    
    var sAppid = advertising[num].toform
    console.log(sAppid)
    wx.navigateToMiniProgram({
      appId: sAppid,
      // path: 'pages/index/index', //跳转后进入的页面不填默认首页
      // envVersion: 'develop', //要打开的小程序版本非必填
      success(res) {
        // 打开成功
        wx.showToast({
          title: '正在跳转',
          icon: 'success',
          duration: 1500
        })
      },
      fail(){
        wx.showToast({
          title: '跳转失败',
          icon: 'success',
          duration: 1500
        })
      }
    })
  },
  // 公交换乘策略(点击显示)
  bindpath:function(){
    var that = this;
    that.setData({
      pathList: (!that.data.pathList),
    })
  },
  //点击公交换乘策略切换
  bindstrat:function(e){
    var that = this;
    var strategy = that.data.strategy;  //声明公交换乘策略数组
    var tapStrategy = that.data.tapStrategy;  //声明点击后要赋值的数组
    // console.log(strategy)
    // console.log(e.currentTarget.dataset.num)
    var num = e.currentTarget.dataset.num;  //声明点击的是数组的num
    var bindStrategy = that.data.bindStrategy; //声明当前选择的乘车策略
    //使用find方法查找到当前为true的唯一元素改为false然后下一步进行赋值
    var s = strategy.find(function(v){    //根据唯一标识查找数组里唯一的元素
        return v.upjt == true ;
    })
    s.upjt = false; //把查找到的这个唯一元素改为false
    strategy[num].upjt = !(strategy[num].upjt);
    tapStrategy = strategy[num].name;
    that.setData({
      strategy: strategy,
      pathList:false,
      tapStrategy: tapStrategy,
      bindStrategy: num
    })
    that.getNavBus();
  },
  // 公交策略
  getNavBus: function () {
    var that = this;
    var bindStrategy = that.data.bindStrategy;  //获取选择的公交换乘策略
    var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({ key: key });
    // var origin = that.data.queryLocatuin.startLocation
    // console.log(origin)
    myAmapFun.getTransitRoute({
      origin: that.data.queryLocatuin.startLocation,
      destination: that.data.queryLocatuin.endLocation,
      city: '太原市',
      strategy: bindStrategy,
      success: function (data) {
        console.log('data')
        console.log(data)
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
            // console.log(departureStop)
            transits[i].transport = [];
            for (var j = 0; j < segments.length; j++) {
              if (segments[j].bus && segments[j].bus.buslines && segments[j].bus.buslines[0] && segments[j].bus.buslines[0].name) {
                var name = segments[j].bus.buslines[0].name;
                var sname = name.replace(/\(.*\)$/g, "");   //用正则判断去掉()里的内容
                // console.log(sname)
                if (j !== 0) {
                  sname = '-->' + sname;
                }
                transits[i].transport.push(sname);
              }
            }
          }
        }
        that.setData({
          transits: transits
        });
        app.globalData.transits = transits; //赋值到全局变量里
      },
      fail: function (info) {
        console.log('info');
        console.log(info);
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
    // console.log(result); 
    return result;
    
  }
})