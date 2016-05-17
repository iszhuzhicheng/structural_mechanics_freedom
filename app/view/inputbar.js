define(['./canvas', 'react', 'reactdom'],function(canvasV, React, ReactDOM){

  return new (Backbone.View.extend({
    
    el: $("#inputbar"),

    events: {
      "keyup": "postcheck"
    },

    initialize: function() {
      this.listenTo(canvasV.factory, "change:type", this.main)
    },

    main: function(index, type) {
      this.input.typeChange(type)
    },

    isntend: true,

    postcheck: function(e) {
      var inputs = this.$el.find("input")
        , type = canvasV.factory.get("type")
        , isntConstr = canvasV.factory.retrRule(type)["category"] !== "constr"

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

      if (canvasV.factory.get("type") !== "linebar") canvasV.factory.set("angle", angle)

      while (barlength < 0) barlength = Math.abs(barlength)

      var kx = Math.cos(Math.PI * angle / 180)
        , ky = Math.sin(Math.PI * angle / 180)
        , X = canvasV.factory.get("x") + kx * barlength
        , Y = canvasV.factory.get("y") + ky * barlength

      if (canvasV.factory.get("x2")) {

        canvasV.factory.set({
          "x": canvasV.factory.get("x2")
          , "y": canvasV.factory.get("y2")
        })

        X = canvasV.factory.get("x") + kx * barlength
        Y = canvasV.factory.get("y") + ky * barlength
      }

      canvasV.setCoor(e, X, Y)
    },

    clean: function() {
      this.$el.find("input").val("")
    },

    input: (function(){

      var Input = React.createClass({

        displayName: "Input",

        getInitialState: function () {
          return {
            angle: true
          }
        },

        typeChange: function (type) {
          
          if (type == "gdj" || type == "hdj" || type == "dxj" || type == "gdd") {

            this.setState({
              angle: true
              , line: false
            })
          } else if (type == "linebar") {

            this.setState({
              angle: true
              , line: true
            })
          } else {

            this.setState({
              angle: false
              , line: false
            })
          }
        },

        render: function () {

          return React.createElement(
            "div",
            null,
            this.state.angle ? React.createElement(
              "div",
              { className: "txt" },
              React.createElement("input", { type: "text", id: "angle", placeholder: "angle" }),
              React.createElement("label", { htmlFor: "angle", className: "inputangle" })
            ) : null,
            this.state.line ? React.createElement(
              "div",
              { className: "txt" },
              React.createElement("input", { type: "text", id: "line", placeholder: "line" }),
              React.createElement("label", { htmlFor: "line", className: "inputline" })
            ) : null
          )
        }
      })

      return ReactDOM.render(React.createElement(Input, null), document.getElementById('inputbar'))
    })()
    
  }))()
})
