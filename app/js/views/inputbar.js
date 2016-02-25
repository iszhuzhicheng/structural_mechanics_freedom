App.Views.ibar = Backbone.View.extend({
  el: $("#inputbar"),

  events: {
    "keyup": "postcheck"
  },

  initialize: function() {
    this.listenTo(App.factoryM, "change:type", this.main)
  },

  main: function(index, type) {
    App.InputRendered.typeChange(type)
  },

  isntend: true,

  postcheck: function(e) {
    var inputs = this.$el.find("input")
      , factory = App.factoryM
      , type = App.factoryM.get("type")
      , isntConstr = App.factoryM.retrRule(type)["category"] !== "constr"

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
    var factory = App.factoryM
      , angle = Number(Number($("#angle").val()).toFixed(0))
      , barlength = Number(Number($("#line").val()).toFixed(0))

    while (angle < 0) angle += 360

    while (angle > 360) angle -= 360

    if (factory.get("type") !== "linebar") factory.set("angle", angle)

    while (barlength < 0) barlength = Math.abs(barlength)

    var kx = Math.cos(Math.PI * angle / 180)
      , ky = Math.sin(Math.PI * angle / 180)
      , X = factory.get("x") + kx * barlength
      , Y = factory.get("y") + ky * barlength

    if (factory.get("x2")) {

      factory.set({
        "x": factory.get("x2")
        , "y": factory.get("y2")
      })

      X = factory.get("x") + kx * barlength
      Y = factory.get("y") + ky * barlength
    }

    App.canvV.setCoor(e, X, Y)
  },

  clean: function() {
    this.$el.find("input").val("")
  }
})