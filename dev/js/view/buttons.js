(function(){
  var buttonsView = pubsubz.addObserver({
  	el:'#buttons',

    buttons: {},

    initButtons: function(topic){
      var that = this

      $(this.el).find('canvas').each(function(){
        var button = new createjs.Stage(this.id)
          , color = '#000'
          , data

        button.type = this.id

        if (button.type === 'gdj'||button.type === 'hdj'){
          button.data = {x:25,y:15,angle:0,color:color}
          button.inputNum = 1
        }

        if (button.type === 'gdd'|| button.type === 'dj'|| button.type === 'bar'){
          button.data = {x:25,y:25,angle:30,color:color}

          if (button.type === 'bar'){
            button.inputNum = 2
          } else if (button.type === 'gdd'){
            button.inputNum = 1
          } else{
            button.inputNum = 0
          }
        }

        if (button.type === 'dxj'){
          button.data = {x:40,y:25,angle:0,color:color}
          button.inputNum = 1
        }

        if (button.type === 'move'){
          button.data = {x:6,y:12,text:'move',color:color}
          button.inputNum = 0
        }

        that.buttons[this.id] = button
    	})

      _.each(that.buttons,function(button){
        drawButton(button)
      })
    },

    focusIt: (function(){
      var redraw = function(button,color){
        button.removeAllChildren()
        button.update()
        button.data.color = color
        drawButton(button)
      }

      return function(topic, data){
        if (data.prevtype !== void 0&& data.prevtype !== data.type){
          redraw(this.buttons[data.prevtype], "#000")
        }

        redraw(this.buttons[data.type], "#7a52d4")
      }
    })(),

    renderInputs: function(topic, data){
      var inputNum = this.buttons[data.type].inputNum

      pubsubz.publish('v->v renderInputs', inputNum)
    },

    changeCursor: function(topic, data){
      pubsubz.publish('v->v changeCursor', data.type)
    },

    drawNewline: function(topic, data){
      pubsubz.publish('v->v drawNewline')
    },
  })

  buttonsView.subscribe('init', buttonsView.initButtons)
  buttonsView.subscribe('m->v selectButton', buttonsView.focusIt)
  buttonsView.subscribe('m->v selectButton', buttonsView.renderInputs)
  buttonsView.subscribe('m->v selectButton', buttonsView.changeCursor)
  buttonsView.subscribe('m->v selectButton', buttonsView.drawNewline)

  function drawButton(button){
    var type = button.type === 'bar' ? 'line' : button.type

    pubsubz.publish('v->f draw',{canvas: button, type: type, data: button.data})
  }

})()
