//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    level1:[],
    level2:[],
    level3:[]
  },
  onLoad: function () {
    this.setData({
      level1: (wx.getStorageSync('maxscore1') || []),
      level2: (wx.getStorageSync('maxscore2') || []),
      level3: (wx.getStorageSync('maxscore3') || []),
    });
  }
})
