define(['app/model/calculate','./draw','app/model/nomo','app/view/result'],function(calulateM,drawC,nomoM,result){

  return new (Backbone.Collection.extend({
    model: calulateM,

    comparator: 'id',

    initialize: function() {
        this.listenTo(nomoM, "calculate", this.captain)
        this.on("remove", this.mate)
    },

    captain: function(model){
    
      if (model.connects.length == 0 || this.models.length == 0) {

        this.add({
          c: [
              {
                order: model.order
                , category: model.category
                , type: model.type
                , p1: model.p1
                , p2: model.p2
              }
            ]
          , out: {
            f: model.category == "bar" ? 3 : 0
            , c: 0
          }
          , in: 0
          , id: this.models.length
        })
      } else {
        this[model.type](model)
      }

      result.render(this.models)
    },

    linebar: function(model) {
      
      var linktime = 0
        // 连接的刚片数
        , ctime = 0
        , changed
        // 注入
        , calculating = []
        , existedP
        , ids = []
        , p1 = model.p1
        , p2 = model.p2      

      _.each(this.models, function(calculative) {

        var calculative = calculative.toJSON()

        _.each(calculative.c, function(c) {

          var cp1 = c.p1
            , cp2 = c.p2 ? c.p2 : null
            , coorp
                
          if (!_.contains(model.connects,c.order)) return

          if (changed !== calculative.id) {
            ids.push(calculative.id)
            changed = calculative.id
            ctime++
          }

          if (p1 == cp1 ||p1 == cp2) coorp = p1
          else if (p2 == cp1 ||p2 == cp2) coorp = p2

          if (
            _.some(model.bodys,function(body){

              return (body.p1 == cp1 && body.p2 == cp2) || (body.p1 == cp2 && body.p2 == cp1)
            })||coorp !== existedP) linktime++          

          existedP = coorp

        }.bind(this))
      }.bind(this))    
      
      var m = this.get(ids[0])
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")

      if (ctime == 2) {

        var sm = this.get(ids[1])
          , sm_c = sm.get("c")
          , sm_out = sm.get("out")
          , sm_in = sm.get("in")

        m_c = m_c.concat(sm_c)
        m_out.f = m_out.f + sm_out.f - 3
        m_out.c = m_out.c + sm_out.c
        m_in += sm_in

        this.remove(this.at(ids[1]))
      } else if (linktime > 1){      
        // alert(1)
        m_in += 3
      }

      m_c.push({
        order: model.order
        , category: model.category
        , type: model.type
        , p1: model.p1
        , p2: model.p2
      })

      m.set("c", m_c)
      m.set("out", m_out)
      m.set("in", m_in)

      this.set(m, {
        remove: false
      })                                    
    },  

    dj: function(model){

      var order = model.connects[0]
        , id = _.filter(this.models,function(thismodel){

          var thismodel = thismodel.toJSON()

          return _.some(thismodel.c,function(c){                     
            return c.order == order
          })
        })[0].id
        , queue = nomoM.get(model.p1)
        , ring = 0
        , m = this.get(id)
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")

      if (queue) m_in -= (queue.length - 1) 

      if (nomoM.marked.hasOwnProperty(model.p1)) nomoM.marked[model.p1] = true
         
      while(queue&& queue.length > 0) {

        var v =  queue.shift()
          , arr = []

        nomoM.dfs(v,arr,queue)
        queue = _.difference(queue,arr)
        ring++        
      }

      // 减少外部约束数，还是增加外部自由度的，这里今后要视情况而定
      if (ring > 0) m_out.f += (ring - 1)    

      m_c.push({
        order: model.order
        , category: model.category
        , type: model.type
        , p1: model.p1
        , p2: model.p2
      })

      m.set("c",m_c)

      m.set("in", m_in)

      m.set("out", m_out)

      this.set(m, { remove: false }) 

      nomoM.recover()
    },

    gdj: function(model){
      this.dj(model)
    },

    hdj: function(model){

    },

    gdd: function(model){

    },

    dxj: function(model){

    },

    mate: function() {
      var collection = _.map(this.toJSON(), function(model, index) {
        model.id = index
        return model
      })

      this.reset(collection)
    }
  }))()
})