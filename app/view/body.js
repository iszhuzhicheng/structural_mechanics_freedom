define(['./canvas','./result','./componentbar','./inputbar'],function(canvas,result,componentbar,inputbar){
  new (Backbone.View.extend({
    el: document.body,

    events: {
      "keyup": "main"
    },

    initialize: function() {
      [canvas, result, componentbar, inputbar]
      .forEach(function(v) {
        v.$el.css("display", "block")
      })
    },

    main: function(e) {
      // 如果keyup对象不是body，退出函数
      if (e.target.id !== "") return

      if (e.which == 37 || e.which == 39)
        componentbar.main(e)
      else if (e.which == 83)
        inputbar.postcheck(e)
      
    }
  }))()
})