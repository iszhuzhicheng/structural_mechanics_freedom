define(['app/model/calculate','./draw','app/model/nomo','app/collection/linkedbar','app/view/result'],
  function(calulateM,drawC,nomoM,linkedbarC,resultV){

  return new (Backbone.Collection.extend({
    model: calulateM,

    comparator: 'id',

    initialize: function() {
        this.listenTo(nomoM, "calculate", this.captain)
        this.on("remove", this.mate)
    },

    captain: function(modelObj){
      var model = modelObj.model
        , models = modelObj.models

      if (model.connects.length == 0 || this.models.length == 0) {

        this.add({
          c: [
              {
                order: model.order
                , category: model.category
                , type: model.type
                , p1: model.p1
                , p2: model.p2
                , outc: 0            
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
        this[model.type](model,models)
      }

      resultV.render(this.models)
    },

    linebar: function(model) {

      // console.log(JSON.stringify(model))

      var linktime = 0
        , djlinktime = 0   
        , gdjlinktime = 0
        , hdjlinktime = 0
        , gddlinktime = 0
        , dxjlinktime = 0
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
            }) || coorp !== existedP || ((type == "dj"|| type == "gdj" || type == "hdj") && 
            (model.p1 == cp1 || model.p2 == cp1)) ) {

              if (type == "dj"||type == "gdj"||type == "hdj"  ) { 
                djlinktime++

                if (type == "gdj"){ 

                  gdjlinktime++
                }

                if (type == "hdj"){
                  hdjlinktime++
                }

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
             
              m_out.f += (3 - gdjlinktime * 2 - hdjlinktime * 2)
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

            // 最强补丁
            linkedbarC.islinkedbar = true         
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
          if (gdjlinktime > 0){
            m_out.f += 1
          } else {
            m_out.f += 3
          }

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
        , outc: gddlinktime * 3 + dxjlinktime * 2 + gdjlinktime * 2 + hdjlinktime * 1
      })

      m.set("c", m_c)
      m.set("out", m_out)
      m.set("in", m_in)

      this.set(m, {
        remove: false
      })                                    
    },  

    dj: function(model, ctype, models){

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
        , outc = 0
  
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

      if (ctype == "gdj" || ctype == "hdj"){

        if (model.bodys.length == 0){
          this.search.dj.getmarked[model.p1] = true
          outc = this.search.dj.getbfs(model.p1, 0, m_c) 
        } else {
          var bodyp = nomoM.gdjlinkedlist.find(model.bodys[0]["p1"]) ? model.bodys[0]["p1"] : model.bodys[0]["p2"]
          this.search.dj.getmarked[bodyp] = true
          outc = this.search.dj.getbfs(bodyp, 0, m_c) 
        }

        this.search.dj.getrecover()

        var f = ctype == "gdj" ? 2 : 1
          , result = outc - f
        
        if (result <= -1){
          m_out.f -= 2
        } else if (result == 0){
          m_out.f -= 1
          m_out.c += 1
        } else if (result > 0){
          m_out.c += 2
        }

        _.each(model.connects,function(connect){

          var p1 = models[connect].p1
            , p2 = models[connect].p2

            // 取得与铰连接的杆的末端
            , p = p1 == model.p1 ? p2 : p1
            , anotherp = p1 == model.p1 ? p1 : p2

          thismodel = _.findWhere(m_c,{p1:p1,p2:p2})

          if (ctype == "gdj"){
            thismodel.outc += 2

            this.search.dj.putmarked[anotherp] = true
            m_c = this.search.dj.putbfs(p, m_c)  
            this.search.dj.putrecover()               
          } else if (ctype == "hdj"){
            thismodel.outc += 1
          }

        }.bind(this))        
        
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
    
    gdj: function(model, models){
      this.dj(model,'gdj',models)      
    },

    hdj: function(model, models){
      this.dj(model,'hdj',models)    
    },

    gdd: function(model){

    },

    dxj: function(model){

    },

    search: {
      dj: {
        putbfs: function(p, m_c){
          var cnomo = $.extend(true,{}, nomoM.toJSON())   
            , queue = []

          this.putmarked[p] = true

          queue.push(p)

          while (queue.length > 0){

            var v = queue.shift()

            if (v !== undefined&& this.put&& nomoM.djlinkedlist.find(v)){
              m_c = this.put(v, m_c)
            }
            else if (cnomo[v] != undefined) {

              for (var i = 0;i < cnomo[v].length; i++){

                var w = cnomo[v][i]

                if (!this.putmarked[w]) {
                  this.putmarked[w] = true
                  queue.push(w)
                }
              }
            }
          }

          return m_c
        },

        put: function(v, m_c){

          _.each(nomoM.get(v),function(p){

            if (this.putmarked[p]){
              return
            }

            var thismodel = _.filter(m_c,function(c){
              return (c.p1 == v && c.p2 == p) || (c.p1 == p && c.p2 == v)
            })[0]

            if (!thismodel.autodj){
              thismodel.outc += 1
              thismodel.autodj = true
            }
            
          }.bind(this))   

          return m_c       
        },

        putmarked:{},            

        putrecover: function(){
          for (var i in this.putmarked) this.putmarked[i] = false
        },

        getbfs: function(p,outc,m_c){
          var cnomo = $.extend(true,{}, nomoM.toJSON())   
            , queue = []

          this.getmarked[p] = true

          queue.push(p)

          while (queue.length > 0){

            var v = queue.shift()

            if (cnomo[v] != undefined){

              for (var i = 0;i < cnomo[v].length; i++){

                var w = cnomo[v][i]
                          
                if (!this.getmarked[w]) { 

                  var outc = this.get(v, w, outc, m_c)

                  this.getmarked[w] = true

                  if (!nomoM.djlinkedlist.find(w)){
                    queue.push(w)
                  }                  
                }
              }
            }
          }

          return outc
        },

        get: function(v, w, outc, m_c){

          var thismodel = _.filter(m_c,function(c){
            return (c.p1 == v && c.p2 == w) || (c.p1 == w && c.p2 == v)
          })[0]

          if (thismodel.outc){
            outc += thismodel.outc
          }

          return outc
        },

        getmarked:{},

        getrecover: function(){
          for (var i in this.getmarked) this.getmarked[i] = false
        }
      }
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