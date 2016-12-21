(function(){
  var drawFactory = pubsubz.addObserver({
    draw: function(topic,canvasPackage){
      var factory = new DrawFactory()
        , type = canvasPackage.type
        , self = canvasPackage.self
        , existed = canvasPackage.existed
        , data = canvasPackage.data
        , isMouseover = canvasPackage.isMouseover
    
      factory.createPart(type)

      var component = factory.componentDraw(data, isMouseover, self)

      if (!existed){
        if (component.data && component.data.type === 'bar'){
          canvasPackage.canvas.addChildAt(component,0)
        } else {
          canvasPackage.canvas.addChild(component)
        }
      }

      canvasPackage.canvas.update()
    },

    install: function(topic,libfactories){
      this.factories = libfactories
    },

    factories: {}
  })

  drawFactory.subscribe('install',drawFactory.install)
  drawFactory.subscribe('v->f draw',drawFactory.draw)

  function DrawFactory(){}

  DrawFactory.prototype.createPart = function(type){
    this.componentDraw = function(data, isMouseover, self){
      var data = _.clone(data)

      if (isMouseover){
        data.color = data.mouseoverColor
      }

      var component = drawFactory.factories[type](data, self)

      return component
    }
  }

})()
