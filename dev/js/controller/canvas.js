(function(){
  var canvasController = pubsubz.addObserver({
    register: function(){
      $('#canvas').on("click",function(e){
        var x = e.pageX - $('#canvaswrap').offset().left
          , y = e.pageY - $('#canvaswrap').offset().top

        pubsubz.publish('c->v setCanvasModel',{x:x,y:y})
      })
    }
  })

  canvasController.register()

  canvasController.subscribe('v->c recoverCanvasclick', canvasController.register)
})()
