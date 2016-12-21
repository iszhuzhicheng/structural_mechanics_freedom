pubsubz.inputsModel = (function(){
  var inputsModel = pubsubz.addObserver({
    model: Model({
      angle: 0
    }),

    update: function(topic, val){
      this.model.angle = Number(val)
    }
  })

  inputsModel.subscribe('c->m updateInputs',inputsModel.update)

  return inputsModel
})()
