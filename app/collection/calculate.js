define(['app/model/calculate','./draw','app/view/result'],function(calulateM,drawC,result){

  return new (Backbone.Collection.extend({
    model: calulateM,

    comparator: 'id',

    initialize: function() {
      this.listenTo(drawC, "add", this.captain)
      this.on("remove", this.mate)
      this.on("add",this.rest)
    },

    tools: {
      b2bhead: function(x, y, x2, y2, newx, newy, newx2, newy2, d) {

        return this.p2pdistance(x, y, newx, newy) <= d ||
          this.p2pdistance(x2, y2, newx, newy) <= d ||
          this.p2pdistance(x, y, newx2, newy2) <= d ||
          this.p2pdistance(x2, y2, newx2, newy2) <= d
      }
      , p2pdistance: function(x1, y1, x2, y2) {

        if (x1 == null || y1 == null || x2 == null || y2 == null) return Infinity

        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
      }
    },

    rest: function(model){
      var model = model.toJSON();

    },

    captain: function(model){

      var model = model.toJSON()

      if (model.connects.length == 0 || this.models.length == 0) {

        this.add({
          c: [
              {
                order: model.order
                , category: model.category
                , type: model.type
                , x1: model.x
                , y1: model.y
                , x2: model.x2 ? model.x2 : null
                , y2: model.y2 ? model.y2 : null
              }
            ]
          , out: {
            f: model.category == "bar" ? 3 : 0
            , c: 0
          }
          , in: 0
          , id: this.models.length
        })
      } else if (model.category == "bar") {

        this.line(model)
      }

      result.render(this.models)
    },

    line: function(model) {
      
      var linktime = 0
        // 连接的刚片数
        , ctime = 0
        , changed
        // 注入
        , calculating = []
        , existedX
        , existedY
        , ids = []

      _.each(model.connects, function(connectorder) {
        var x1 = model.x
          , y1 = model.y
          , x2 = model.x2 ? model.x2 : null
          , y2 = model.y2 ? model.y2 : null

        _.each(this.models, function(calculative) {

          var calculative = calculative.toJSON()

          _.each(calculative.c, function(c) {
            var cx1 = c.x1
              , cy1 = c.y1
              , cx2 = c.x2 ? c.x2 : null
              , cy2 = c.y2 ? c.y2 : null
              , coorx
              , coory
                  
            if (c.order !== connectorder) return

            if (changed !== calculative.id) {
              ids.push(calculative.id)
              changed = calculative.id
              ctime++
            }

            if (this.tools.b2bhead(x1, y1, null, null, cx1, cy1, cx2, cy2, 0)) {
              coorx = x1
              coory = y1
            } else if (this.tools.b2bhead(x2, y2, null, null, cx1, cy1, cx2, cy2, 0)) {
              coorx = x2
              coory = y2
            }

            if (coorx !== existedX || coory !== existedY) {
              linktime++
            }

            existedX = coorx
            existedY = coory

          }.bind(this))
        }.bind(this))
      }.bind(this))
    

      var m = this.get(ids[0])
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")

      if (ctime == 2) {

        var sm = this.get(ids[1])
          , sm_c = sm.get("c")
          , sm_out = sm.get("out")
          , sm_in = sm.get("in")

        m_c = m_c.concat(sm_c)
        m_out.f = m_out.f + sm_out.f - 3
        m_out.c = m_out.c + sm_out.c
        m_in += sm_in

        this.remove(this.at(ids[1]))
      } else if (linktime > 1){        
        m_in += 3
      }

      m_c.push({
        order: model.order
        , category: model.category
        , type: model.type
        , x1: model.x
        , y1: model.y
        , x2: model.x2 ? model.x2 : null
        , y2: model.y2 ? model.y2 : null
      })

      m.set("c", m_c)
      m.set("out", m_out)
      m.set("in", m_in)

      this.set(m, {
        remove: false
      })                                    
    },  

    mate: function() {
      var collection = _.map(this.toJSON(), function(model, index) {
        model.id = index
        return model
      })

      this.reset(collection)
    }
  }))()
})
