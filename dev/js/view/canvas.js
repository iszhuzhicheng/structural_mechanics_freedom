(function(buttonsModel, inputsModel){

  var canvasView =  pubsubz.addObserver({
  	el:'#canvaswrap',

    canvas: new createjs.Stage('canvas'),

    changeCursor: function(topic, id){
      if (id === 'move'){
        $(this.el).find('#canvas').addClass('move')
      } else {
        $(this.el).find('#canvas').removeClass('move')
      }
    },

    setCanvasModel: function(topic, data){

      var x = data.x
        , y = data.y
        , type = buttonsModel.model.type

      if (buttonsModel.model.prevtype === 'bar'){
        this.data.prevx = this.data.x
        this.data.prevy = this.data.y
      } else {
        delete this.data.prevx
        delete this.data.prevy
        pubsubz.publish('v->v drawNewline')
      }

      if (data.side && (type === 'gdd' || type === 'dxj')){
        this.data.side = data.side
      } else {
        delete this.data.side
      }

      if (data.sidecomponent){
        this.data.sidecomponents.push(data.sidecomponent)
      }

      this.data.x = x
      this.data.y = y
      this.data.type = type
      this.data.color = buttonsModel.color[type]
      this.data.mouseoverColor = '#000'
      this.data.angle = inputsModel.model.angle

      pubsubz.publish('v->m setButtonPrevtype', this.data.type)

      if (this.data.type === 'move') return
      if (this.data.type === 'bar'&& this.data.prevx === void 0) return

      pubsubz.publish('v->m setCanvasModel',this.data)

    },

    addCanvasElem: function(topic, data){
      var data = _.clone(data)
        , component = new createjs.Container()

      component.isMouseover = true
      component.data = data

      if (!data.side){
        pubsubz.publish('v->d addMouseover', {
          component: component,
          canvas: canvasView.canvas
        })
      }

      while (data.sidecomponents.length){

        pubsubz.publish('v->d removeMouseover', {
          component: data.sidecomponents.pop(),
          currentdata: data
        })
      }

      pubsubz.publish('v->f draw', {
        canvas: canvasView.canvas,
        type: data.type,
        data: data,
        self: component
      })

      pubsubz.publish('v->v drawNewline')
    },

    clearSides: function(topic, data){
      this.data.sidecomponents = []
    },

    data:{
      sidecomponents:[]
    }
  })

  canvasView.canvas.enableMouseOver()

  canvasView.subscribe('v->v changeCursor', canvasView.changeCursor)
  canvasView.subscribe('c->v setCanvasModel', canvasView.setCanvasModel)
  canvasView.subscribe('m->v addCanvasElem', canvasView.addCanvasElem)
  canvasView.subscribe('v->v drawNewline', canvasView.clearSides)

})(pubsubz.buttonsModel, pubsubz.inputsModel)
