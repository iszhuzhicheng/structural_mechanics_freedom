define(['./canvas','./resultbox','./componentbar','./inputbar','app/collection/calculate'],function(canvas,resultbox,componentbar,inputbar){
  // App 在这里开启





  new (Backbone.View.extend({

    // 绑定到已存在的元素上，而非生成一个新的元素
    el: document.body,

    // 敲击键盘时触发事件
    events: {
      "keyup": "main"
    },

    // 启动画效果
    initialize: function() {
      [canvas, resultbox, componentbar, inputbar]
      .forEach(function(v) {
        v.$el.css("display", "block")
      })
    },

    main: function(e) {

      // keyup对象不是body，退出函数
      if (e.target.id !== "") return

      // 左右键切换功能
      if (e.which == 37 || e.which == 39){
        componentbar.main(e)
      }
      // s键确认输入
      else if (e.which == 83){
        inputbar.postcheck(e)
      }
      
    }
  }))()
})