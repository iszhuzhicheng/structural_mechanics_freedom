define(['./input','./canvas'],function(input,canvas){

  return new (Backbone.View.extend({
    
    el: $("#inputbar"),

    events: {
      "keyup": "postcheck"
    },

    initialize: function() {
      this.listenTo(canvas.factory, "change:type", this.main)
    },

    main: function(index, type) {
      input.typeChange(type)
    },

    isntend: true,

    postcheck: function(e) {
      var inputs = this.$el.find("input")
        , type = canvas.factory.get("type")
        , isntConstr = canvas.factory.retrRule(type)["category"] !== "constr"

      if ((e.which !== 83 && e.type == "keyup") || inputs.length == 0) return

      if (e.which == 83 && (e.target.id == "angle" || e.target.id == "line")) {
        var length = $("#" + e.target.id).val().length
          , num = $("#" + e.target.id).val().slice(0, length - 1)

        $("#" + e.target.id).val(num)
      }

      if (!_.every(inputs, validate)) return;

      function validate(value, key) {
        var val = $(value).val()
          , isEmpty = val.length == 0 || /^\s+$/.test(val)
          , isntNumber = isNaN(Number(val))

        if ((isEmpty && isntConstr) || isntNumber) return false
        else return true
      }

      this.post(e)
    },

    post: function(e) {
      var angle = Number(Number($("#angle").val()).toFixed(0))
        , barlength = Number(Number($("#line").val()).toFixed(0))

      while (angle < 0) angle += 360

      while (angle > 360) angle -= 360

      if (canvas.factory.get("type") !== "linebar") canvas.factory.set("angle", angle)

      while (barlength < 0) barlength = Math.abs(barlength)

      var kx = Math.cos(Math.PI * angle / 180)
        , ky = Math.sin(Math.PI * angle / 180)
        , X = canvas.factory.get("x") + kx * barlength
        , Y = canvas.factory.get("y") + ky * barlength

      if (canvas.factory.get("x2")) {

        canvas.factory.set({
          "x": canvas.factory.get("x2")
          , "y": canvas.factory.get("y2")
        })

        X = canvas.factory.get("x") + kx * barlength
        Y = canvas.factory.get("y") + ky * barlength
      }

      canvas.setCoor(e, X, Y)
    },

    clean: function() {
      this.$el.find("input").val("")
    }
  }))()
})
