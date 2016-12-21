pubsubz.canvasModel = (function(){
  var canvasModel = pubsubz.addObserver(new Graph({
    add: function(topic,data){
      this.adj.push(data)

      pubsubz.publish('m->v addCanvasElem', data)
    }
  }))

  canvasModel.subscribe('v->m setCanvasModel',canvasModel.add)

  function Graph(funcs){

    for (var m in funcs){
      this[m] = funcs[m]
    }

    this.adj = []
  }

  return canvasModel

})()
