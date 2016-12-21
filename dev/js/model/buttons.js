pubsubz.buttonsModel = (function(){
  var buttonModel = pubsubz.addObserver({
    model: Model(),

    focuIt: function(topic,type){

      if (type === this.model.type){
        this.model.set({'prevtype': type})
      }

      this.model.set({'type':type})
    },

    lightMouseover: function(topic, data){
      var type = this.model.type

      if (type === data.type || _.contains(data.type, type)){
        data.func()
      }
    },

    setPrevtype: function(topic, prevtype){
      this.model.set({'prevtype': prevtype})
    },

    clearPrev: function(){
      this.model.set({'prevtype': undefined})
    },

    color:{
      'gdj': '#273fa5',
      'hdj': '#278ca5',
      'gdd': '#27a574',
      'dxj': '#9ea527',
      'dj': '#27a580',
      'bar': '#a54527'
    }
  })

  buttonModel.subscribe('c->m selectButton',buttonModel.focuIt)
  buttonModel.subscribe('v->m setButtonPrevtype',buttonModel.setPrevtype)
  buttonModel.subscribe('v->m lightMouseover',buttonModel.lightMouseover)
  buttonModel.subscribe('d->m drawNewline',buttonModel.clearPrev)

  buttonModel.model.on('type',focuIt)

  function focuIt(type, prevtype){
    buttonModel.model.set({'prevtype': prevtype})
    pubsubz.publish('m->v selectButton', {type: type, prevtype: prevtype})
  }

  return buttonModel
})()
