var app = getApp()
Page({
  data: {
    motto: '开始游戏',
    userInfo: {},
  },
  startLevel:function(event){
    wx.navigateTo({
      url: '../game/game?level=' + event.currentTarget.dataset.level
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})