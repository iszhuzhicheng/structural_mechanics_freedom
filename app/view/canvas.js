define(['app/collection/draw','./canvasdraw','app/model/factory'],function(drawC,canvasdraw,factory){

  return new (Backbone.View.extend({

    el: $("#canvaswrap"),

    initialize: function() {
      this.listenTo(factory, "change:type", this.movable)
      this.listenTo(drawC, "add", this.presolve)
      this.canvas = this.$el.find("canvas")
      this.drawlib = canvasdraw.draw()
      this.factory = factory
    },

    presolve: function(newmodel) {
      var i = 0
        , models = drawC.models
        , l = models.length
        , xy = newmodel.get("category") == "constr" ? {
          "x": newmodel.get("x")
          , "y": newmodel.get("y")
        } : {
          "x": newmodel.get("x2")
          , "y": newmodel.get("y2")
        }

      this.factory.set(xy)
      this.drawlib[newmodel.get("type")](newmodel)

      for (; i < l - 1; i++) this.$el.find("#canvas").removeLayer('sign' + i)
    },

    tools: {
      connect: function(connect1, order1, connect2, order2) {
        if (!_.contains(connect1, order2)) connect1.push(order2)
        if (!_.contains(connect2, order1)) connect2.push(order1)
      }
      , p2pdistance: function(x1, y1, x2, y2) {
        if (x1 == null || y1 == null || x2 == null || y2 == null) return Infinity
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
      }
      , p2ldistance: function(k, b, newx, newy) {
        return Math.abs((newx - newy / k + b / k) / Math.sqrt(1 + 1 / (k * k)))
      }
      , isp2l: function(x, y, x2, y2, k, b, newx, newy, d) {
        return this.region(newx, newy, x, y, x2, y2, d + 2, d + 2) && this.p2ldistance(k, b, newx, newy) <= d + 2
      }
      , b2bhead: function(x, y, x2, y2, newx, newy, newx2, newy2, d) {
        return this.p2pdistance(x, y, newx, newy) <= d ||
          this.p2pdistance(x2, y2, newx, newy) <= d ||
          this.p2pdistance(x, y, newx2, newy2) <= d ||
          this.p2pdistance(x2, y2, newx2, newy2) <= d
      }
      , region: function(x, y, regionx1, regiony1, regionx2, regiony2, dx, dy) {
        var maxX = regionx1 >= regionx2 ? regionx1 : regionx2
          , minX = maxX == regionx1 ? regionx2 : regionx1
          , maxY = regiony1 >= regiony2 ? regiony1 : regiony2
          , minY = maxY == regiony1 ? regiony2 : regiony1

        return x <= maxX + dx && y <= maxY + dy && x >= minX - dx && y >= minY - dy
      }
      , coorSet: function(factory, x, y, angle, barlength) {
        if (factory.get("x") && factory.get("type") == "linebar") {
          factory.set({
            "x2": x
            , "y2": y
          })
        }
        else {
          factory.set({
            "x": x
            , "y": y
          })

          if (factory.get("type") == "linebar"&&angle&&barlength){
            var kx = Math.cos(Math.PI * angle / 180)
              , ky = Math.sin(Math.PI * angle / 180)

            factory.set({
              "x2": Number((x + kx*barlength).toFixed(0))
              , "y2": Number((y + ky*barlength).toFixed(0))
            })
          }
        }
      }
      , kSimilar: function(k){
        var k = Math.abs(k) > 9999 ? (k < 0 ? -10000 : 10000) : k
          , k = Math.abs(k) < 0.0001 ? 0.0001 : k

        return Number(k.toFixed(4))
      }
    },

    events: {
      "click canvas": "setCoor"
    },

    setCoor: function(e, X, Y) {
      if ($("canvas").hasClass("moving")) return

      if (drawC.models.length == 0)
        this.factory.set("order", 0)
      else
        this.factory.set("order", drawC.last().get("order") + 1)

      if (!this.factory.get("connects")) {
        this.factory.set("connects", [])
      }

      if (!this.factory.get("bodys")) {
        this.factory.set("bodys", [])
      }
      
      var leftpos = this.$el.css("left").indexOf("px")
        , toppos = this.$el.css("top").indexOf("px")
        , borderpos = this.$el.css("border-width").indexOf("px")
        , angle = Number(Number($("#angle").val()).toFixed(0))
        , bodys = this.factory.get("bodys")
        , barlength = Number(Number($("#line").val()).toFixed(0))
        , borderwidth = Number(this.$el.css("border-width").slice(0, borderpos))
        // 画布的left偏移等于其父元素的left偏移加上边框宽度
        , left = Number(Number(this.$el.css("left").slice(0, leftpos)).toFixed(0)) + borderwidth
        , top = Number(Number(this.$el.css("top").slice(0, toppos)).toFixed(0)) + borderwidth
        // 此次点击的坐标
        , X = e.type == "click" ? e.pageX - this.canvas.position().left - left : X
        , Y = e.type == "click" ? e.pageY - this.canvas.position().top - top : Y
        , newx = this.factory.get("x")
        , newy = this.factory.get("y")
        , neworder = this.factory.get("order")
        , newtype = this.factory.get("type")
        , newcategory = this.factory.get("category")
        , newconnects = this.factory.get("connects")
        , coinarr = []
        // 定向铰和固定端连接在n根杆上
        , bartime = 0
        // 点击与n跟杆接近
        , n = 0
        , pointx, pointy
        // 约束端部重合
        , coincide = false
        // 杆端端部重合
        , barcide = false
        , preventdraw = false

      this.factory.set("angle", angle)
  
      if (
        _.some(drawC.models, function(model) {
          var category = model.get("category")
            , type = model.get("type")
            , x1 = model.get("x")
            , x2 = model.get("x2")
            , y1 = model.get("y")
            , y2 = model.get("y2")

          // 防止两约束重合
          if (category == "constr" && newcategory == "constr" && this.tools.p2pdistance(x1, y1, X, Y) < 10) {
            return true
          }

          // 防止多根杆连接在定向铰和固定端上
          else if (newcategory == "bar" &&
            (type == "gdd" || type == "dxj") &&
            (
              this.tools.p2pdistance(X, Y, x1, y1) < 5 ||
              this.tools.p2pdistance(newx, newy, x1, y1) < 5
            ) && model.get("connects").length > 0
          ) {
            return true
          }

          // 防止定向铰和固定端连接在多根杆上
          else if (model.get("category") == "bar" &&
            (newtype == "gdd" || newtype == "dxj") &&
            (
              this.tools.p2pdistance(X, Y, x1, y1) < 5 ||
              this.tools.p2pdistance(X, Y, x2, y2) < 5
            )
          ) {
            bartime++

            if (bartime > 1)
              return true
            else
              return false
          } else
            return false
        }.bind(this))) return
      
      _.each(drawC.models, function(model, index, list) {
        var k = model.get("k")
          , b = model.get("b")
          , x1 = model.get("x")
          , x2 = model.get("x2")
          , y1 = model.get("y")
          , y2 = model.get("y2")
          , d1 = this.tools.p2pdistance(x1, y1, X, Y) < 5
          , d2 = model.get("x2") ? this.tools.p2pdistance(x2, y2, X, Y) < 5 : undefined
          , order = model.get("order")
          , category = model.get("category")
          , connects = model.get("connects")
          , coinx = d1 ? x1 : x2
          , coiny = d1 ? y1 : y2
          // 处理由于约束存在而造成的杆件断开
          , commonconnects

        // 约束与杆端部重合
        if ((d1 || d2) && newcategory == "constr") {

          if (!coincide) {
            this.tools.coorSet(this.factory, coinx, coiny)
            coincide = true
          }

          this.tools.connect(connects, order, newconnects, neworder)
        }

        // 切断杆
        if (coincide && index == list.length - 1) {

          _.each(newconnects, function(connect) {
            var connectmodel = drawC.at(connect)
              , preconnects = _.filter(newconnects, function(preconnect) {
                return preconnect !== connect
              })

            connectmodel.set("connects", _.filter(connectmodel.get("connects"), function(currentconnect) {
              return !_.contains(preconnects, currentconnect)
            }))
          })
        }

        if (newcategory == "bar") {

          // 杆端部相连
          if (this.tools.b2bhead(x1, y1, x2, y2, newx, newy, X, Y, 5)) {

            // bar和newbar连在了同一个约束上，那不添加到彼此的连接件上
            if (category == "bar" &&
              _.some(connects, function(connect) {
                if (!drawC.at(connect)) return false

                var category = drawC.at(connect).get("category")
                  , x1 = drawC.at(connect).get("x")
                  , y1 = drawC.at(connect).get("y")

                if (category == "constr" && this.tools.b2bhead(x1, y1, null, null, newx, newy, X, Y, 0)) return true
              }.bind(this))
            ) return

            if (this.tools.b2bhead(x1, y1, null, null, null, null, X, Y, 5)) {
              X = x1
              Y = y1
            } else if (this.tools.b2bhead(x2, y2, null, null, null, null, X, Y, 5)) {
              X = x2
              Y = y2
            }

            this.tools.connect(connects, order, newconnects, neworder)
            this.factory.set("connects", newconnects)
          }
        }

        // 点到杆的距离 作用域与值域范围 约束端部重合 杆端部重合
        if (this.tools.p2ldistance(k, b, X, Y) > 4 || !this.tools.region(X, Y, x1, y1, x2, y2, 4, 4) || coincide || barcide) return

        // 垂线交点坐标 
        pointx = Number(((Y + X / k - b) / (k + 1 / k)).toFixed(0))
        pointy = Number((pointx * k + b).toFixed(0))

        // 杆身相连
        if (newcategory == "bar") {
          X = pointx
          Y = pointy

          bodys.push({
            x1: x1
            , y1: y1
            , x2: x2
            , y2: y2
          })

          this.factory.set("bodys",bodys)

          this.tools.connect(connects, order, newconnects, neworder)
        }

        // 约束与杆身连接 偏移约束
        if (_.contains(["gdj", "hdj", "dj"], newtype)) {
          n++

          var dx = 6 / Math.sqrt(1 + (-1 / k) * (-1 / k))
            , dy = 6 * (-1 / k) / Math.sqrt(1 + (-1 / k) * (-1 / k))

          X = pointx > X ? pointx - dx : pointx + dx
          Y = pointy > Y ? pointy - dy : pointy + dy

          this.tools.connect(connects, order, newconnects, neworder)
        }

        // 防止定向支座和固定端与杆身相连
        if (_.contains(["gdd", "dxj"], newtype)) preventdraw = true

      }.bind(this))

      if (n > 1 || preventdraw) return

      this.tools.coorSet(this.factory, X, Y, angle, barlength)

      this.factory.drawelement()
    },

    movable: function(index, value) {
      if (value == "move") {
        this.canvas.draggable({
          disabled: false
        })
        
        this.canvas.css({
          cursor: "-moz-grab"
          , cursor: "-webkit-grab"
        })
      } else {
        this.canvas.draggable({
          disabled: true
        })

        this.canvas.css({
          cursor: "crosshair"
        })
      }
    }

  }))()
})