(function(){
  var inputsView =  pubsubz.addObserver({
  	el:'#inputs',

    renderInputs: function(topic, num){
      if (num === 1){
        $(inputsView.el).find('#angle').attr('disabled',false)
      } else {
        $(inputsView.el).find('input').attr('disabled',true)
      }
    }
  })

  inputsView.subscribe('v->v renderInputs',inputsView.renderInputs)
})()
