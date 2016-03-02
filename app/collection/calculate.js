define(['app/model/calulate','app/collection/draw','app/view/canvas'],function(calulateM,drawC,canvas){

  return new (Backbone.Collection.extend({
    model: calulateM,

    url:'http://zhouhansen.github.io/structural_mechanics_freedom/app.json',

    comparator: 'id',

    initialize: function() {
      this.listenTo(drawC, "add", this.captain)
      this.on("remove", this.mate)
    },

    captain: function(model) {
      var model = model.toJSON()
        // 连接数
        , linktime = 0
        // 连接的刚片数
        , ctime = 0
        , changed
        // 注入
        , calculating = []
        , existedX
        , existedY
        , ids = []

      if (model.connects.length == 0 || this.models.length == 0) {

        var newmodel = {
          c: [{
            order: model.order
            , category: model.category
            , type: model.type
            , x1: model.x
            , y1: model.y
            , x2: model.x2 ? model.x2 : null
            , y2: model.y2 ? model.y2 : null
          }]
          , outter: {
            f: model.category == "bar" ? 3 : 0
            , c: 0
          }
          , inner: 0
          , id: this.models.length
        }

        this.add(newmodel)
      } else {

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

              if (canvas.tools.b2bhead(x1, y1, null, null, cx1, cy1, cx2, cy2, 0)) {
                coorx = x1
                coory = y1
              } else if (canvas.tools.b2bhead(x2, y2, null, null, cx1, cy1, cx2, cy2, 0)) {
                coorx = x2
                coory = y2
              }

              if (coorx !== existedX || coory !== existedY) {
                linktime++
              }

              existedX = coorx
              existedY = coory

            })
          }.bind(this))
        }.bind(this))
      }

      if (model.category == "bar" && ctime > 0) {

        var updatemodel = this.get(ids[0])
          , updatemodel_c = updatemodel.get("c")
          , updatemodel_inner = updatemodel.get("inner")
          , updatemodel_outter = updatemodel.get("outter")

        if (ctime == 1) {

          if (linktime > 1) updatemodel_inner += 3

        } else if (ctime == 2) {

          var sendmodel = this.get(ids[1])
            , sendmodel_c = sendmodel.get("c")
            , sendmodel_outter = sendmodel.get("outter")
            , sendmodel_inner = sendmodel.get("inner")

          updatemodel_c = updatemodel_c.concat(sendmodel_c)
          updatemodel_outter.f = updatemodel_outter.f + sendmodel_outter.f - 3
          updatemodel_outter.c = updatemodel_outter.c + sendmodel_outter.c
          updatemodel_inner += sendmodel_inner

          this.remove(this.at(ids[1]))
        }

        updatemodel_c.push({
          order: model.order
          , category: model.category
          , type: model.type
          , x1: model.x
          , y1: model.y
          , x2: model.x2 ? model.x2 : null
          , y2: model.y2 ? model.y2 : null
        })

        updatemodel.set("c", updatemodel_c)
        updatemodel.set("outter", updatemodel_outter)
        updatemodel.set("inner", updatemodel_inner)

        this.set(updatemodel, {
          remove: false
        })
      }
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
