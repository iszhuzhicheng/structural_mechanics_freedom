(function(){
  $('#inputs').on('keyup','input',function(e){
    pubsubz.publish('c->m updateInputs',$(this).val())
  })
})()
