App.calculate = function(model) {
  var calculatives = this.calculatives
    // 连接数
    , linktime = 0
    // 连接的刚片数
    , ctime = 0
    , changed
    // 注入
    , calculating = []
    , id = calculatives.length
    , existedX
    , existedY

  model = model.toJSON()

  if (calculatives.length == 0 || model.connects.length == 0) {

    calculatives.push({
      c: [{
        order: 0
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
      , id: id
    })
  } else {

    _.each(model.connects, function(neworder) {

      _.each(calculatives, function(calculative, index) {

        _.each(calculative["c"], function(c) {
          if (changed !== index) {
            changed = index
            ctime++
          }

          if (c.order == neworder)
            linktime++
        })
      })
    })
  }

  if (ctime == 1 && model.category == "bar") {

    calculatives[changed]["c"].push({
      order: model.order
      , category: model.category
      , type: model.type
      , x1: model.x
      , y1: model.y
      , x2: model.x2 ? model.x2 : null
      , y2: model.y2 ? model.y2 : null
    })

    if (linktime > 1) {
      calculatives[changed]["inner"] += 3
    }
  }

  App.test(calculatives)
}