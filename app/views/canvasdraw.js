App.Views.canvdraw = Backbone.View.extend({
  draw: function() {
    var canvas = $(this.canvas)
      , sin = Math.sin
      , cos = Math.cos
      , atan = Math.atan
      , Pi = Math.PI
      , blackArc = function(x, y) {
        canvas.drawArc({
          layer: true
          , strokeWidth: 1
          , strokeStyle: '#fff'
          , fillStyle: '#fff'
          , x: x
          , y: y
          , radius: 3.5
        })
      }
      , whiteArc = function(x, y) {
        canvas.drawArc({
          layer: true
          , strokeWidth: 1
          , strokeStyle: '#df701e'
          , x: x
          , y: y
          , radius: 5
        })
      }
      , drawline = function(x1, y1, x2, y2, color) {
        if (!color)
          var color = '#434343';

        canvas.drawLine({
          layer: true
          , strokeStyle: color
          , strokeWidth: 2
          , x1: x1
          , y1: y1
          , x2: x2
          , y2: y2
        })
      }

    return {
      signDraw: function(text, order, x, y) {
        canvas.drawText({
          layer: true
          , name: "sign" + order
          , visible: true
          , fillStyle: "seagreen"
          , x: x
          , y: y
          , fontSize: 14
          , fontFamily: 'Verdana, sans-serif'
          , text: text
        })
      },

      dj: function(model) {
        var x = model.get("x")
          , y = model.get("y")

        whiteArc(x, y)

        _.each(model.get("connects"), function(num) {
          if (App.drawC.models[num].get("category") == "bar" &&
            model.get("type") !== "gdd" &&
            model.get("type") !== "dxj") {
            blackArc(x, y);
          }
        })
      },

      linebar: function(model) {
        var x1 = model.get("x")
          , y1 = model.get("y")
          , x2 = model.get("x2")
          , y2 = model.get("y2")

        drawline(x1, y1, x2, y2)

        _.each(model.get("connects"), function(num) {
          var x = App.drawC.models[num].get("x")
            , y = App.drawC.models[num].get("y")

          if (App.drawC.models[num].get("category") == "constr" &&
            App.drawC.models[num].get("type") !== "gdd" &&
            App.drawC.models[num].get("type") !== "dxj") {
            blackArc(x, y)
          }
        })

      },

      gdj: function(model) {
        var x = model.get("x")
          , y = model.get("y")
          , angle = Pi * model.get("angle") / 180
          , x2 = x + 18 * sin(-angle) - 10 * sin(Pi / 2 + angle)
          , y2 = y + 18 * cos(-angle) + 10 * cos(Pi / 2 + angle)
          , x3 = x + 18 * sin(-angle) + 10 * sin(Pi / 2 + angle)
          , y3 = y + 18 * cos(-angle) - 10 * cos(Pi / 2 + angle)
          , lx11 = x + 4 * sin(-angle) + 2.5 * sin(Pi / 2 + angle)
          , ly11 = y + 4 * cos(-angle) - 2.5 * cos(Pi / 2 + angle)
          , lx12 = x + 12.5 * sin(-angle) + 7.5 * sin(Pi / 2 + angle)
          , ly12 = y + 12.5 * cos(-angle) - 7.5 * cos(Pi / 2 + angle)
          , lx21 = x + 4 * sin(-angle) - 2.5 * sin(Pi / 2 + angle)
          , ly21 = y + 4 * cos(-angle) + 2.5 * cos(Pi / 2 + angle)
          , lx22 = x + 12.5 * sin(-angle) - 7.5 * sin(Pi / 2 + angle)
          , ly22 = y + 12.5 * cos(-angle) + 7.5 * cos(Pi / 2 + angle)
          , lx31 = x + 17.5 * sin(-angle) + 5.5 * sin(Pi / 2 + angle)
          , ly31 = y + 17.5 * cos(-angle) - 5.5 * cos(Pi / 2 + angle)
          , lx32 = x + 17.5 * sin(-angle) - 5.5 * sin(Pi / 2 + angle)
          , ly32 = y + 17.5 * cos(-angle) + 5.5 * cos(Pi / 2 + angle)
          , lx41 = x - 5 * sin(angle)
          , ly41 = y + 5 * cos(angle)
          , lx42 = x - 18 * sin(angle)
          , ly42 = y + 18 * cos(angle)
          , lx51 = x + 19 * sin(-angle) + 6 * sin(Pi / 2 + angle)
          , ly51 = y + 19 * cos(-angle) - 6 * cos(Pi / 2 + angle)
          , lx52 = x + 19 * sin(-angle) - 6 * sin(Pi / 2 + angle)
          , ly52 = y + 19 * cos(-angle) + 6 * cos(Pi / 2 + angle)

        whiteArc(x, y)
        whiteArc(x2, y2)
        whiteArc(x3, y3)

        drawline(lx11, ly11, lx12, ly12, "#5a4283")
        drawline(lx21, ly21, lx22, ly22, "#5a4283")
        drawline(lx31, ly31, lx32, ly32, "#5a4283")
        drawline(lx41, ly41, lx42, ly42, "#5a4283")
        drawline(lx51, ly51, lx52, ly52, "#5a4283")

        _.each(model.get("connects"), function(num) {
          if (App.drawC.models[num].get("category") == "bar") {
            blackArc(x, y)
          }
        })
      },

      hdj: function(model) {
        var x = model.get("x")
          , y = model.get("y")
          , angle = Pi * model.get("angle") / 180
          , x2 = x + 18 * sin(-angle)
          , y2 = y + 18 * cos(-angle)
          , lx11 = x + 5 * sin(-angle)
          , ly11 = y + 5 * cos(-angle)
          , lx12 = x + 12.5 * sin(-angle)
          , ly12 = y + 12.5 * cos(-angle)
          , lx21 = x + 18 * sin(-angle) - 5 * sin(Pi / 2 + angle)
          , ly21 = y + 18 * cos(-angle) + 5 * cos(Pi / 2 + angle)
          , lx22 = x + 18 * sin(-angle) - 15 * sin(Pi / 2 + angle)
          , ly22 = y + 18 * cos(-angle) + 15 * cos(Pi / 2 + angle)
          , lx31 = x + 18 * sin(-angle) + 5 * sin(Pi / 2 + angle)
          , ly31 = y + 18 * cos(-angle) - 5 * cos(Pi / 2 + angle)
          , lx32 = x + 18 * sin(-angle) + 15 * sin(Pi / 2 + angle)
          , ly32 = y + 18 * cos(-angle) - 15 * cos(Pi / 2 + angle)
          , lx41 = x + 20 * sin(-angle) + 4 * sin(Pi / 2 + angle)
          , ly41 = y + 20 * cos(-angle) - 4 * cos(Pi / 2 + angle)
          , lx42 = x + 20 * sin(-angle) + 15 * sin(Pi / 2 + angle)
          , ly42 = y + 20 * cos(-angle) - 15 * cos(Pi / 2 + angle)
          , lx51 = x + 20 * sin(-angle) - 4 * sin(Pi / 2 + angle)
          , ly51 = y + 20 * cos(-angle) + 4 * cos(Pi / 2 + angle)
          , lx52 = x + 20 * sin(-angle) - 15 * sin(Pi / 2 + angle)
          , ly52 = y + 20 * cos(-angle) + 15 * cos(Pi / 2 + angle)

        whiteArc(x, y)
        whiteArc(x2, y2)
        drawline(lx11, ly11, lx12, ly12, "#5a4283")
        drawline(lx21, ly21, lx22, ly22, "#5a4283")
        drawline(lx31, ly31, lx32, ly32, "#5a4283")
        drawline(lx41, ly41, lx42, ly42, "#5a4283")
        drawline(lx51, ly51, lx52, ly52, "#5a4283")

        _.each(model.get("connects"), function(num) {
          if (App.drawC.models[num].get("category") == "bar")
            blackArc(x, y);
        })
      },

      gdd: function(model) {
        var x = model.get("x")
          , y = model.get("y")
          , bias = Math.sqrt(7.5 * 7.5 + 7.5 * 7.5)
          , angle = Pi * model.get("angle") / 180
          , lx11 = x
          , ly11 = y
          , lx12 = x - 15 * sin(-angle)
          , ly12 = y - 15 * cos(-angle)
          , lx21 = x
          , ly21 = y
          , lx22 = x + 15 * sin(-angle)
          , ly22 = y + 15 * cos(-angle)
          , lx31 = x + 7.5 * sin(-angle)
          , ly31 = y + 7.5 * cos(-angle)
          , lx32 = x + 7.5 * sin(-angle) + bias * sin(-angle - Pi / 4)
          , ly32 = y + 7.5 * cos(-angle) + bias * cos(-angle - Pi / 4)
          , lx41 = x
          , ly41 = y
          , lx42 = x + bias * sin(-angle - Pi / 4)
          , ly42 = y + bias * cos(-angle - Pi / 4)
          , lx51 = x - 7.5 * sin(-angle)
          , ly51 = y - 7.5 * cos(-angle)
          , lx52 = x - 7.5 * sin(-angle) + bias * sin(-angle - Pi / 4)
          , ly52 = y - 7.5 * cos(-angle) + bias * cos(-angle - Pi / 4)
          , lx61 = x - 15 * sin(-angle) + bias * sin(-angle - Pi / 4)
          , ly61 = y - 15 * cos(-angle) + bias * cos(-angle - Pi / 4)
          , lx62 = x - 15 * sin(-angle)
          , ly62 = y - 15 * cos(-angle)

        drawline(lx11, ly11, lx12, ly12, "#5a4283")
        drawline(lx21, ly21, lx22, ly22, "#5a4283")
        drawline(lx31, ly31, lx32, ly32, "#5a4283")
        drawline(lx41, ly41, lx42, ly42, "#5a4283")
        drawline(lx51, ly51, lx52, ly52, "#5a4283")
        drawline(lx61, ly61, lx62, ly62, "#5a4283")
      },

      dxj: function(model) {
        var x = model.get("x")
          , y = model.get("y")
          , angle = Pi * model.get("angle") / 180
          , x1 = x + 10 * sin(-angle)
          , y1 = y + 10 * cos(-angle)
          , x2 = x - 10 * sin(-angle)
          , y2 = y - 10 * cos(-angle)
          , x3 = x - 25 * cos(-angle) - 10 * sin(-angle)
          , y3 = y + 25 * sin(-angle) - 10 * cos(-angle)
          , x4 = x - 25 * cos(-angle) + 10 * sin(-angle)
          , y4 = y + 25 * sin(-angle) + 10 * cos(-angle)
          , lx11 = x + 5 * sin(-angle)
          , ly11 = y + 5 * cos(-angle)
          , lx12 = x - 5 * sin(-angle)
          , ly12 = y - 5 * cos(-angle)
          , lx21 = x - 5 * cos(-angle) - 10 * sin(-angle)
          , ly21 = y + 5 * sin(-angle) - 10 * cos(-angle)
          , lx22 = x - 20 * cos(-angle) - 10 * sin(-angle)
          , ly22 = y + 20 * sin(-angle) - 10 * cos(-angle)
          , lx31 = x - 5 * cos(-angle) + 10 * sin(-angle)
          , ly31 = y + 5 * sin(-angle) + 10 * cos(-angle)
          , lx32 = x - 20 * cos(-angle) + 10 * sin(-angle)
          , ly32 = y + 20 * sin(-angle) + 10 * cos(-angle)
          , lx41 = x - 25 * cos(-angle) + 5 * sin(-angle)
          , ly41 = y + 25 * sin(-angle) + 5 * cos(-angle)
          , lx42 = x - 25 * cos(-angle) - 5 * sin(-angle)
          , ly42 = y + 25 * sin(-angle) - 5 * cos(-angle)
          , lx51 = x - 25 * cos(-angle) - 15 * sin(-angle)
          , ly51 = y + 25 * sin(-angle) - 15 * cos(-angle)
          , lx52 = x - 25 * cos(-angle) - 20.5 * sin(-angle)
          , ly52 = y + 25 * sin(-angle) - 20.5 * cos(-angle)
          , lx61 = x - 25 * cos(-angle) + 15 * sin(-angle)
          , ly61 = y + 25 * sin(-angle) + 15 * cos(-angle)
          , lx62 = x - 25 * cos(-angle) + 20.5 * sin(-angle)
          , ly62 = y + 25 * sin(-angle) + 20.5 * cos(-angle)
          , lx71 = x
          , ly71 = y
          , lx72 = x - 25 * cos(angle)
          , ly72 = y - 25 * sin(angle)

        whiteArc(x1, y1)
        whiteArc(x2, y2)
        whiteArc(x3, y3)
        whiteArc(x4, y4)
        drawline(lx11, ly11, lx12, ly12, "#5a4283")
        drawline(lx21, ly21, lx22, ly22, "#5a4283")
        drawline(lx31, ly31, lx32, ly32, "#5a4283")
        drawline(lx41, ly41, lx42, ly42, "#5a4283")
        drawline(lx51, ly51, lx52, ly52, "#5a4283")
        drawline(lx61, ly61, lx62, ly62, "#5a4283")
        drawline(lx71, ly71, lx72, ly72, "#5a4283")
      }
    }
  }
})