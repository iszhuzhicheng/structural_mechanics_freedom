define(['app/model/calculate','./draw','app/model/nomo','app/collection/linkedbar','app/view/result'],
  function(calulateM,drawC,nomoM,linkedbarC,resultV){

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

      resultV.render(this.models)
    },

    linebar: function(model) {

      // console.log(JSON.stringify(model))

      var linktime = 0
        , djlinktime = 0   
        // 连接的刚片数
        , ctime = 0
        , changed
        , existedP
        , ids = []
        , p1 = model.p1
        , p2 = model.p2
        , ctimep
        , ctimep2

      _.each(this.models, function(calculative) {

        var calculative = calculative.toJSON()

        _.each(calculative.c, function(c) {

          var cp1 = c.p1
            , cp2 = c.p2 ? c.p2 : null
            , coorp
            , type = c.type
                
          if (!_.contains(model.connects,c.order)) {
            return
          }

          if (changed !== calculative.id) {

            ctime++

            ids.push(calculative.id)

            changed = calculative.id

            if (nomoM.djlinkedlist.find(cp1)||nomoM.djlinkedlist.find(cp2)) {
            
              if (!ctimep){
                ctimep = (p1 == cp1 || p1 == cp2) ? p1 : p2
              } else {
                ctimep2 = (p1 == cp1 || p1 == cp2) ? p1 : p2
              }
            }
            
            
          }

          if (p1 == cp1 ||p1 == cp2) coorp = p1
          else if (p2 == cp1 ||p2 == cp2) coorp = p2
         
          if (
            _.some(model.bodys,function(body){

              return (body.p1 == cp1 && body.p2 == cp2) || (body.p1 == cp2 && body.p2 == cp1)
            }) || coorp !== existedP || (type == "dj" && (model.p1 == cp1 || model.p2 == cp1)) ) {

              if (type == "dj") { 
                djlinktime++

                if (existedP !== cp1) {
                  linktime++  
                }
              } else {
                linktime++  
              }                      
          }

          existedP = coorp

        }.bind(this))
      }.bind(this))    
      
      var m = this.get(ids[0])
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")

      // alert(linktime + " " + djlinktime + " " + ctime)
    
      if (ctime == 2) {

        var sm = this.findWhere({id:ids[1]})
          , sm_c = sm.get("c")
          , sm_out = sm.get("out")
          , sm_in = sm.get("in")

        m_c = m_c.concat(sm_c)

        //alert(djlinktime + " " + m_out.f + " " + sm_out.f)

        if (djlinktime == 0){
          m_out.f = m_out.f + sm_out.f - 3
        }
        else if (djlinktime == 1&& nomoM.general(ctimep).length > 1){

          // 以后要看它是否连接了大地约束，是改变外部还是内部约束
          if (!nomoM.outsidedj.hasOwnProperty(ctimep)){
            nomoM.outsidedj[ctimep] = 2
          } else {
            nomoM.outsidedj[ctimep]++
          }

          if (nomoM.get(ctimep).length > 1){
            m_out.f += 1
          }

        }
        else if (djlinktime == 2) {

          //第一根杆
          if (nomoM.general(ctimep2)) {
            if (nomoM.general(ctimep).length == 1&& nomoM.general(ctimep2).length == 1){
              m_out.f += 3
            } else {
              m_out.f += 1
            }
          } else {
            
            m_out.f += 1
          }
     
        } else {
          m_out.f += sm_out.f
        }
        // console.log(JSON.stringify(nomoM.outsidedj))
        m_out.c = m_out.c + sm_out.c
        m_in += sm_in

        this.remove(this.at(ids[1]))
      } else if (linktime > 1){ 
        var haslinked = 0     

        if (linkedbarC.islinkedbar){
      
          linkedbarC.each(function(linkedbar){
            var linkedbarlist = linkedbar.get("linkedbar")

            if (linkedbarlist.find(linkedbarC.p1)&& linkedbarlist.find(linkedbarC.p2)){
              console.log(linkedbar.get("start") + " " + linkedbar.get("end"))
              haslinked += 1
            }

          })
        }
          
        if (djlinktime == 0) {
          console.log(linkedbarC.islinkedbar)
          if ((linkedbarC.islinkedbar&& nomoM.getPj(linkedbarC.p1,linkedbarC.p2))|| m_out.f < 4){

            m_in += 3
          } else {
            m_in += 2
            m_out.f -= 1
          }
          
        } else if (djlinktime == 1) {

          if (linkedbarC.islinkedbar){
      
            //console.log(linkedbarC.p1 + " " + linkedbarC.p2)
            if (nomoM.getPj(linkedbarC.p1,linkedbarC.p2)|| m_out.f < 4 || linkedbarC.p2 == linkedbarC.p1){

              if (haslinked > 1){
                m_in += 1
                m_out.f -= 1
              } else {
                m_in += 2
              }              
            } else {
              // 另外要减掉一根可旋转的杆
              // 两铰已相连
             
              if (haslinked >= 2){

                m_out.f -= 1
                m_in += 1
              } else {

                m_out.f -= 2
              }
            }
          } else {
            m_in += 2
          }

        } else if (djlinktime == 2) {

          if (linkedbarC.islinkedbar){
            if (nomoM.getPj(linkedbarC.p1,linkedbarC.p2)|| m_out.f < 4|| haslinked >= 2){
              m_in += 1
            } else {
              m_out.f -= 1
            }
          }
          
        }
        // alert(m_in)
      } else if (linktime == 1 && djlinktime == 1) {
        // 以后要看它是否连接了大地约束，是改变外部还是内部约束
       
        if (nomoM.general(ctimep) && nomoM.general(ctimep).length == 1) {

          //第一根杆

          m_out.f += 3
        } else {
                            
          if (!nomoM.outsidedj.hasOwnProperty(ctimep)){
            nomoM.outsidedj[ctimep] = 2
          } else {
            nomoM.outsidedj[ctimep]++
          } 

          //第n根杆
          m_out.f += 1
        }
      }

      //alert(JSON.stringify(nomoM.outsidedj))
      if (ctime == 1&& linktime > 1) {

        _.each(nomoM.outsidedj,function(v,dj){

          // 用general处理杆身相连的状况
          var queue = nomoM.general(dj)
            , ring = 0
     
          if (queue){

            nomoM.marked[dj] = true

            while (queue.length > 0) {

              var v = queue[0]  
                , arr = []

              arr = nomoM.dfs(v,arr,queue)

              queue = _.difference(queue,arr)
              ring++
            }

            var trans = nomoM.outsidedj[dj] - ring

            nomoM.outsidedj[dj] -= trans

            if (!linkedbarC.islinkedbar) {
              m_out.f -= trans
              // alert("pre:" + m_in)
              m_in -= trans
              // alert("after:" + m_in)
            }

            if (nomoM.outsidedj[dj] == 1) {
              delete nomoM.outsidedj[dj]
            }

            nomoM.recover()
          }
        })
      }

      linkedbarC.recover()

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
        , queuelength = queue ? queue.length : false
        , ring = 0
     // , ringplus = nomoM.barbody[model.p1] ? nomoM.barbody[model.p1] : 0
        , m = this.get(id)
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")
               
      if (nomoM.marked.hasOwnProperty(model.p1)) nomoM.marked[model.p1] = true

      while(queue&& queue.length > 0) {

        var v =  queue[0]
          , arr = []
        // console.log(v)  
        arr = nomoM.dfs(v,arr,queue)
        
        queue = _.difference(queue,arr)
        ring++        
      }

      if (ring > 1) {

        if (!nomoM.outsidedj.hasOwnProperty(model.p1)){
          nomoM.outsidedj[model.p1] = 2
        } else {
          nomoM.outsidedj[model.p1]++
        }
      }

      // 减少外部约束数，还是增加外部自由度的，这里今后要视情况而定
      if (ring > 0) m_out.f += (ring - 1)  

      // console.log(ring)

      // 减少内部约束数  
      if (queue) {

        if (m_in == 0){
          m_out.f += (queuelength - ring) 
        } else {
          m_in -= (queuelength - ring)  
        }
      }

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