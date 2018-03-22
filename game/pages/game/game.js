//index.js
//获取应用实例
var app = getApp()
var allCard = [
  'math_1_1', 'math_1_2', 'math_1_3', 'math_1_4', 'math_1_5', 'math_1_6', 'math_1_7', 'math_1_8', 'math_1_9',
  'math_2_2', 'math_2_3', 'math_2_4', 'math_2_5', 'math_2_6', 'math_2_7', 'math_2_8', 'math_2_9',
  'math_3_3', 'math_3_4', 'math_3_5', 'math_3_6', 'math_3_7', 'math_3_8', 'math_3_9',
  'math_4_4', 'math_4_5', 'math_4_6', 'math_4_7', 'math_4_8', 'math_4_9',
  'math_5_5', 'math_5_6', 'math_5_7', 'math_5_8', 'math_5_9',
  'math_6_6', 'math_6_7', 'math_6_8', 'math_6_9',
  'math_7_7', 'math_7_8', 'math_7_9',
  'math_8_8', 'math_8_9',
  'math_9_9',
];
var backCardImage = "../images/math_bg.png"
Page({
  data: {
    clickNum: 0,              // 点击次数
    useTime: 0,               // 游戏时间  
    checked: 0,               // 已匹配牌数
    allCard: allCard,         // 全部卡牌数组
    backImage: backCardImage, // 牌背面 图片地址
    modalHidden: true,        // 游戏完成提示是否显示
    firstX: -1,               // 点击的第一张卡牌的坐标 
    firstY: -1,
    cards: [],                // 随机挑选出来的牌   
    size: 4,                  // 界面显示的牌数=size
    imageWidth: 0,            // 图片宽度
    imageHeight: 0,           // 图片高度
    clickable: false,         // 当前是否可点击
    timer: '',                // 游戏计时的定时器
    popDesc: '恭喜完成这一关的挑战，下一关！' //完成关卡弹窗描述
  },
  // 开始游戏
  startGame: function () {

    var data = this.data;
    var that = this;
    var arr = [4, 16, 36];
    console.log(this.data.size);
    if (this.data.size == arr[arr.length - 1]) {
      this.setData({
        popDesc: '恭喜通过全部挑战！重新开始挑战？'
      })
    }

    // 打乱牌堆,挑出size/2张牌
    var tmp = this.data.allCard.sort(
      function (a, b) { return Math.random() > .5 ? -1 : 1; }).splice(0, Math.floor(data.size / 2));

    // size张牌,再打乱
    tmp = tmp.concat(tmp).sort(function (a, b) { return Math.random() > .5 ? -1 : 1; });

    // 添加src,state,转成二维数组方面展示 state:0/1/2
    var cards = [];
    var ix = -1; var iy = 0;
    for (var i in tmp) {
      if (i % (Math.sqrt(data.size)) == 0) {
        cards.push([]);
        ix++; iy = 0;
      }
      cards[ix].push({
        src: '../images/' + tmp[i] + '.png',
        state: 1
      });
    }
    this.data.cards = cards;

    //设置图片宽度
    var image_width = '';
    console.log(this.data.size)
    switch (this.data.size) {
      case 4:
        image_width = '350rpx';
        break;
      case 16:
        image_width = '175rpx';
        break;
      case 36:
        image_width = '115rpx';
        break;
    }
    this.setData({
      cards: cards,
      clickNum: 0,
      useTime: 0,
      checked: 0,
      modalHidden: true,
      firstX: -1,
      clickable: false,
      imageWidth: image_width,
      imageHeight: image_width
    });

    var that = this;
    setTimeout(function () {
      that.turnAllBack();  // 所有的牌翻到背面
      console.log('turn all back');
      data.clickable = true; // 开始计时了才让点
      if (data.timer === '') {
        data.timer = setInterval(function () {
          data.useTime++;
          that.setData({ useTime: data.useTime });
        }, 1000); // 游戏开始计时
      } else {
        that.setData({ useTime: 0 });
      }
    }, 2000); // 游戏开始前先让玩家记忆几秒钟
  },

  // 点击item响应函数
  onTap: function (event) {
    var that = this;
    var data = this.data;
    var ix = event.currentTarget.dataset.ix; // 获取点击对象的坐标
    var iy = event.currentTarget.dataset.iy;
    console.log('onTap ' + ix + ' ' + iy);
    if (data.cards[ix][iy].state != 0 || !data.clickable)  // 点击的不是未翻过来的牌或者现在不让点直接pass
      return;
    that.setData({ clickNum: ++data.clickNum }); //点击数加1   

    // 1. 检测是翻过来的第几张牌
    if (data.firstX == -1) {
      // 1.1 第一张修改状态为 1
      data.cards[ix][iy].state = 1;
      data.firstX = ix; data.firstY = iy;  // 记下坐标
      that.setData({ cards: data.cards });     // 通过setData让界面变化
    } else {
      // 1.2 前面已经有张牌翻过来了,先翻到正面然后看是不是一样
      data.cards[ix][iy].state = 1;
      that.setData({ cards: data.cards });
      if (data.cards[data.firstX][data.firstY].src === data.cards[ix][iy].src) {
        // 1.2.1.1 两张牌相同, 修改两张牌的state为2完成配对
        data.cards[data.firstX][data.firstY].state = 2;
        data.cards[ix][iy].state = 2;
        data.checked += 1; // 完成配对数++
        data.firstX = -1; // 准备下一轮匹配 
        // 1.2.1.2 检查是否所有牌都已经翻过来,都已翻过来提示游戏结束
        if (data.checked == data.size / 2) { // 所有牌都配对成功了!
          this.setData({ modalHidden: false });
          clearInterval(this.data.timer); // 暂停计时
          this.data.timer = '';
          var arr = [4, 16, 36];
          var filter = -1;
          for (var i = 0; i < arr.length; i++) {
            if (data.size == arr[i]) {
              filter = i;
              break;
            }
          }
          this.saveScore({ 'size': filter + 1, 'time': data.useTime, 'click': data.clickNum }) // 保存成绩
        }
      } else {  // 1.2.2 两张牌不同, 修改两张牌的state为 0
        data.cards[data.firstX][data.firstY].state = 0;
        data.cards[ix][iy].state = 0;
        data.firstX = -1;
        data.clickable = false;
        setTimeout(function () {
          that.setData({ cards: data.cards, clickable: true });
        }, 500); //过半秒再翻回去
      }
    }
    console.log(this.data.cards);
  },

  //初始化图片
  turnAllBack: function () {
    for (var ix in this.data.cards)
      for (var iy in this.data.cards[ix])
        this.data.cards[ix][iy].state = 0;
    this.setData({ cards: this.data.cards });
  },

  //保存分数
  saveScore: function (score) {
    var maxscore = wx.getStorageSync('maxscore');
    if (maxscore == undefined || maxscore == '')
      maxscore = [];
    maxscore.push(score);
    maxscore = maxscore.sort(function (a, b) {
      if (a.time < b.time)
        return -1;
      else if (a.time == b.time && a.click < b.click)
        return -1;
      else return 1;
    });
    wx.setStorageSync('maxscore', maxscore);
  },
  "disableScroll": true,
  onLoad: function (option) {
    this.startGame();
  },
  //弹窗下一关按钮调用的方法
  modalComfirm: function () {
    var arr = [4, 16, 36];
    if (this.data.size == arr[arr.length - 1]) {
      this.setData({
        size: arr[0]
      })
    } else {
      for (var i = 0; i < arr.length - 1; i++) {
        if (this.data.size == arr[i]) {
          this.setData({
            size: arr[i + 1]
          })
          break;
        }
      }
    }

    this.startGame();
  },
  //弹窗查看排名按钮调用的方法
  modalCancle: function () {
    this.setData({
      modalHidden: true,
    })
    wx.redirectTo({
      url: '../logs/logs'
    })
  },
  onReady: function () {
    console.log("onReady")
  },
  onShow: function () {
    console.log("onShow");
    // if (this.data.checked == this.data.size / 2)
    //   this.startGame()
  },
  onHide: function () {
    console.log("onHide")
  },
  onUnload: function () {
    console.log("onUnload")
  },
  onReachBottom: function () {
    console.log("onReachBottom")
  },
  onShareAppMessage: function () {
    console.log("onShareAppMessage")
  },
  onShareAppMessage: function () {
    console.log('onShareAppMessage')
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/page/user?id=123'
    }
  }
})
