requirejs.config({

  baseUrl: 'vendor'

  , paths: {
      app: '../app'
      , jquery : 'jquery/dist/jquery.min'
      , underscore : 'underscore/underscore-min'
      , backbone : 'backbone/backbone-min'
      , browser : 'browser.min/index'
      , jcanvas : 'jcanvas/jcanvas.min'
      , jqueryui : 'jquery-ui/jquery-ui.min'
      , jqueryuitp : 'jqueryui-touch-punch/jquery.ui.touch-punch.min'
      , pace : 'PACE/pace.min'
      , react : "react/react.min"
      , reactdom : "react/react-dom.min"
  }
})

requirejs(["jquery","pace","jqueryui","underscore","backbone","browser"],function($,pace){

  pace.start()

  requirejs(["jcanvas"],function(){
    
    var preloadImages = ['canvas2', "d", "dxj", "gdd", "gdj", "hdj", "inputangle", "line", "linebar", "mirror", "move"]    
    
    Promise.all(preloadImages.map(function(arg) {

      return new Promise(function(resolve, reject) {

        var image = new Image()

        image.src = "http://zhouhansen.github.io/structural_mechanics_freedom/img/" + arg + ".png"
        
        image.addEventListener("load", function() {
          resolve(arg)
        }, false)

        image.addEventListener("error", function() {
          resolve(arg + "_unloaded")
        }, false)
      })
    })).then(function(imgs) {

      var unloads = _.filter(imgs, function(img) {
        return /_unloaded/.test(img)
      })

      if (unloads.length == 0 || unloads.length == preloadImages.length) requirejs(['app/view/body'])
    })  
  })        
})