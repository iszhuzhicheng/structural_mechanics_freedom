requirejs.config({

  baseUrl: 'app/vendor'

  , paths: {
      app: '../app'
      , jquery : 'jquery/dist/jquery.min'
      , underscore : 'underscore/underscore-min'
      , backbone : 'backbone/backbone'
      , jcanvas : 'jcanvas/jcanvas.min'
      , jqueryui : 'jquery-ui/jquery-ui.min'
      , jqueryuitp : 'jqueryui-touch-punch/jquery.ui.touch-punch.min'
      , pace : 'PACE/pace.min'
      , react : "react/react.min"
      , reactdom : "react/react-dom.min"
      , js_algorithm: "js_algorithm"
  }

})
  
requirejs(["jquery","pace","jqueryui","underscore","backbone"],function($,pace){

  requirejs(["app/route"],function(route){
    var route = new route()

    pace.start()

    route.on("route:app",function(){

      requirejs(["jcanvas"],function(){
        requirejs(['app/view/body'])
      })   

    })

    route.on('route:doc',function(file){

      window.location.href = "docs/" + file + ".html";
    })

    Backbone.history.start()
               
  })
})