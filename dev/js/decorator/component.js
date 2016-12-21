(function(buttonsModel){
  var decorator = pubsubz.addObserver({
    add: function(topic, data){
      if (data.component.isMouseover){
        this.mouseover(data.component, data.canvas)
      } else {
        this.mouseout(data.component, data.canvas)
      }
    },

    mouseover: function(component, canvas){
      component.on('mouseover',function(){
        var that = this
          , type

        if (that.offIt){
          return
        }

        if (_.contains(['gdj','hdj','gdd','dxj','dj'],that.data.type)){
          type = 'bar'
        } else if (that.data.type = 'bar'){
          type = ['gdj','hdj','gdd','dxj','dj','bar']
        }

        pubsubz.publish('v->m lightMouseover',{
          func: function(){
            that.removeAllEventListeners()
            that.removeAllChildren()

            pubsubz.publish('v->f draw', {
              canvas: canvas,
              type: that.data.type,
              data: that.data,
              self: that,
              existed: true,
              isMouseover:true
            })

            that.isMouseover = false

            that.on('click',function(e){
              $('#canvas').off('click')

              if (that.data.type !== 'bar'){
                var data = {x:that.data.x, y:that.data.y}

                if (that.data.type === 'gdd' || that.data.type === 'dxj'){
                  data.sidecomponent = that
                }
              } else {
                var d1 = Math.sqrt(
                  Math.pow(e.rawX-that.data.x,2) + Math.pow(e.rawY-that.data.y,2)
                )
                  , d2 = Math.sqrt(
                  Math.pow(e.rawX-that.data.prevx,2) + Math.pow(e.rawY-that.data.prevy,2)
                )

                // 端点相连
                if (d1<12){
                  var data = {x:that.data.x, y:that.data.y, side:true}
                } else if (d2<12){
                  var data = {x:that.data.prevx, y:that.data.prevy, side:true}

                // 杆身相连
                } else {
                  var k1 = (that.data.y - that.data.prevy)/(that.data.x - that.data.prevx)

                  k1 = Math.abs(k1) > 9999 ? (k1 < 0 ? -10000 : 10000) : k1
                  k1 = Math.abs(k1) < 0.0001 ? 0.0001 : k1

                  var b1 = that.data.y - k1 * that.data.x
                  var dx = 6 / Math.sqrt(1 + (-1 / k1) * (-1 / k1))
                  var dy = 6 * (-1 / k1) / Math.sqrt(1 + (-1 / k1) * (-1 / k1))
                  var x0 = (e.rawY + e.rawX / k1 - b1) / (k1 + 1 / k1)
                  var y0 = e.rawX * k1 + b1
                  var x =  x0 > e.rawX ? x0 - dx : x0 + dx
                  var y =  y0 > e.rawY ? y0 - dy : y0 + dy

                  if (buttonsModel.model.type === 'bar'){
                    return
                  }

                  var data = {x:x, y:y}
                }
              }

              pubsubz.publish('c->v setCanvasModel', data)
              pubsubz.publish('v->c recoverCanvasclick')
            })

            pubsubz.publish('v->d addMouseover', {
              component: that,
              canvas: canvas
            })
          },

          type: type
        })
      })
    },

    mouseout: function(component, canvas){
      component.on('mouseout',function(){


        this.removeAllEventListeners()
        this.removeAllChildren()

        pubsubz.publish('v->f draw', {
          canvas: canvas,
          type: this.data.type,
          data: this.data,
          existed: true,
          self: this
        })

        this.isMouseover = true

        if (this.offIt){
          return
        }

        pubsubz.publish('v->d addMouseover', {
          component: this,
          canvas: canvas
        })

      })
    },

    remove: function(topic, data){
      var cx = data.component.data.x
        , cy = data.component.data.y
        , x = data.currentdata.x
        , y = data.currentdata.y

      data.component.off()
      data.component.offIt = true

      if (cx === x && cy === y){
        pubsubz.publish('d->m drawNewline')
      }
    }
  })

  decorator.subscribe('v->d addMouseover',decorator.add)
  decorator.subscribe('v->d removeMouseover',decorator.remove)
})(pubsubz.buttonsModel)
