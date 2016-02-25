App.Collections.calculate = Backbone.Collection.extend({
  model: App.Models.calculate,

  comparator: 'id',

  initialize: function() {
    this.listenTo(App.drawC, "add", this.main)
  },

  main: function(model){
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

    if (model.connects.length == 0||this.models.length == 0) {

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

      _.each(model.connects, function(neworder) {

        _.each(this.models, function(calculative) {

          _.each(calculative.get("c"), function(c){

            if (changed !== calculative.get("id")) {
              changed = calculative.get("id")
              ctime++
            }

            if (c.order == neworder)
              linktime++            
            })
        }.bind(this))
      }.bind(this))
    }

    if (ctime == 1 && model.category == "bar") {
      var updatemodel = this.get(changed)
        , updatemodel_c = updatemodel.get("c")
        , updatemodel_inner = updatemodel.get("inner")

      if (linktime > 1) {
        updatemodel_inner += 3
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

      updatemodel.set("c",updatemodel_c)
      updatemodel.set("inner",updatemodel_inner)

      this.set(updatemodel,{remove: false})
      App.test(this.models)
    }
  }
})

