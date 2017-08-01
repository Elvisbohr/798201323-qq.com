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
    console.log(transits);
    that.setData({
      transits: transits,
    }) 
  },

  
})