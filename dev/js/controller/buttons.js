(function(){
  $('#buttons').on("click",'canvas',function(e){
    pubsubz.publish('c->m selectButton',e.target.id)
  })
})()
