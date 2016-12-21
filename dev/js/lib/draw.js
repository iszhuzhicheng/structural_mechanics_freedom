(function(){
  var sin = Math.sin
    , cos = Math.cos
    , atan = Math.atan
    , Pi = Math.PI

  // basicElement
  var bE = {
    line: function(x1,y1,x2,y2,color,isBar){
      var line = new createjs.Shape()
        , width = isBar ? 2 : 1
      line.graphics.setStrokeStyle(width)
                   .beginStroke(color)
                   .moveTo(x1, y1)
                   .lineTo(x2, y2)

      return line
    },

    lineback: function(x1,y1,x2,y2){
      var line = new createjs.Shape()

      line.graphics.setStrokeStyle(18)
                   .beginStroke('rgba(255,255,255,0.01)')
                   .moveTo(x1, y1)
                   .lineTo(x2, y2)

      return line
    },

    circle:	function(x, y, r, color){
      var circle = new createjs.Shape()

      circle.graphics.setStrokeStyle(1)
                     .beginFill('#fff')
                     .beginStroke(color)
                     .drawCircle(0, 0, r)
      circle.x = x
      circle.y = y

      return circle
    },

    back: function(x, y, offx, offy, w, l, angle){
      var rect = new createjs.Shape()
      rect.graphics.beginFill('rgba(255,255,255,0.1)').drawRect(offx, offy, w, l)
      rect.x = x
      rect.y = y

      rect.rotation = angle * 180 / Pi

      return rect
    },

    eraser: function(x,y,r){
      var eraser = new createjs.Shape()

      eraser.graphics.setStrokeStyle(1)
                     .beginStroke("#fff")
                     .drawCircle(0, 0, r)
      eraser.x = x
      eraser.y = y

      return eraser
    },

    text: function(x, y, text, color){
      var text = new createjs.Text(text, "16px 'Comic Sans MS'", color)

      text.x = x
      text.y = y

      return text
    }
  }

  var drawlib = {
    gdj: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , x = data.x
        , y = data.y
        , color = data.color
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


      container.addChild(bE.circle(x, y, 5, color))
      container.addChild(bE.circle(x2, y2, 5, color))
      container.addChild(bE.circle(x3, y3, 5, color))
      container.addChild(bE.line(lx11, ly11, lx12, ly12, color))
      container.addChild(bE.line(lx21, ly21, lx22, ly22, color))
      container.addChild(bE.line(lx31, ly31, lx32, ly32, color))
      container.addChild(bE.line(lx41, ly41, lx42, ly42, color))
      container.addChild(bE.line(lx51, ly51, lx52, ly52, color))
      container.addChild(bE.back(x, y, -15, -6, 30, 30, angle))

      return container
    },

    hdj: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , x = data.x
        , y = data.y
        , color = data.color
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

      container.addChild(bE.circle(x, y, 5, color))
      container.addChild(bE.circle(x2, y2, 5, color))
      container.addChild(bE.line(lx11, ly11, lx12, ly12, color))
      container.addChild(bE.line(lx21, ly21, lx22, ly22, color))
      container.addChild(bE.line(lx31, ly31, lx32, ly32, color))
      container.addChild(bE.line(lx41, ly41, lx42, ly42, color))
      container.addChild(bE.line(lx51, ly51, lx52, ly52, color))
      container.addChild(bE.back(x, y, -15, -6, 30, 30, angle))

      return container
    },

    gdd: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , bias = Math.sqrt(7.5 * 7.5 + 7.5 * 7.5)
        , x = data.x
        , y = data.y
        , color = data.color
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

      container.addChild(bE.line(lx11, ly11, lx12, ly12, color))
      container.addChild(bE.line(lx21, ly21, lx22, ly22, color))
      container.addChild(bE.line(lx31, ly31, lx32, ly32, color))
      container.addChild(bE.line(lx41, ly41, lx42, ly42, color))
      container.addChild(bE.line(lx51, ly51, lx52, ly52, color))
      container.addChild(bE.line(lx61, ly61, lx62, ly62, color))
      container.addChild(bE.back(x, y, -8, -15, 20, 30, angle))

      return container
    },

    dxj: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , bias = Math.sqrt(7.5 * 7.5 + 7.5 * 7.5)
        , x = data.x
        , y = data.y
        , color = data.color
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

      container.addChild(bE.circle(x1, y1, 5, color))
      container.addChild(bE.circle(x2, y2, 5, color))
      container.addChild(bE.circle(x3, y3, 5, color))
      container.addChild(bE.circle(x4, y4, 5, color))
      container.addChild(bE.line(lx11, ly11, lx12, ly12, color))
      container.addChild(bE.line(lx21, ly21, lx22, ly22, color))
      container.addChild(bE.line(lx31, ly31, lx32, ly32, color))
      container.addChild(bE.line(lx41, ly41, lx42, ly42, color))
      container.addChild(bE.line(lx51, ly51, lx52, ly52, color))
      container.addChild(bE.line(lx61, ly61, lx62, ly62, color))
      container.addChild(bE.line(lx71, ly71, lx72, ly72, color))
      container.addChild(bE.back(x, y, -30, -15, 36, 30, angle))

      return container
    },

    dj: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , x = data.x
        , y = data.y
        , color = data.color

      container.addChild(bE.circle(x, y, 5, color))
      container.addChild(bE.back(x, y, -8, -7, 16, 14, angle))

      return container
    },

    bar: function(data, self){
      var container = self ? self : new createjs.Container()
        , angle = Pi * data.angle / 180
        , x = data.x
        , y = data.y
        , prevx = data.prevx
        , prevy = data.prevy
        , color = data.color

      container.addChild(bE.line(x, y, prevx, prevy, color, true))
      container.addChild(bE.lineback(x, y, prevx, prevy ))

      return container
    },

    line: function(data){
      var container = new createjs.Container()
        , x = data.x
        , y = data.y
        , color = data.color

      container.addChild(bE.line(x-10, y-10, x+10, y+10, color))

      return container
    },

    move: function(data){
      var container = new createjs.Container()
        , angle = Pi * data.angle / 180
        , x = data.x
        , y = data.y
        , color = data.color
        , text = data.text

      container.addChild(bE.text(x, y, text, color))

      return container
    }
  }

  pubsubz.publish('install',drawlib)
})()
