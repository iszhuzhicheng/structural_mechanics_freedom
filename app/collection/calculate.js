define(['app/model/calculatem','./draw','app/model/nomo','app/collection/linkedbar','app/view/resultbox'],
  function(calulateM,drawC,nomoM,linkedbarC,resultV){
  // 计算模块  
    


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
        , outc = 0
        , autodj = false
        , linebaroutc      

      _.each(this.models, function(calculative) {

        var calculative = calculative.toJSON()

        _.each(calculative.c, function(c) {

          var cp1 = c.p1
            , cp2 = c.p2 ? c.p2 : null
            , coorp
            , type = c.type
            , category = c.category
          
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
            }) || coorp !== existedP || (category == "constr" && 
            (model.p1 == cp1 || model.p2 == cp1)) ) {

              if (category == "constr") { 
                djlinktime++

                if (type == "dxj") {
                  dxjlinktime++
                }

                if (type == "gdj"){ 
                  gdjlinktime++
                }

                if (type == "hdj"){
                  hdjlinktime++
                }

                if (type == "gdd"){
                  gddlinktime++
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

      this.search.linebar.marked[model.p2] = true
      linebaroutc = this.search.linebar.main(model.p1, m_c, true)
      this.search.linebar.recover()
      
      this.search.linebar.marked[model.p1] = true
      linebaroutc += this.search.linebar.main(model.p2, m_c, true)
      this.search.linebar.recover()
  
      if (ctime == 2) {

        var sm = this.findWhere({id:ids[1]})
          , sm_c = sm.get("c")
          , sm_out = sm.get("out")
          , sm_in = sm.get("in")

        m_c = m_c.concat(sm_c)

        if (djlinktime == 0){
          if (linebaroutc >= 3){
            m_out.f = m_out.f 
            m_out.c += (3 - sm_out.f)
          } else {
            m_out.f = m_out.f + sm_out.f - 3     
          }
        }
        else if (djlinktime == 1){
          var minus = 3 - (gddlinktime * 3 + dxjlinktime * 2 + gdjlinktime * 2 + hdjlinktime * 1)
          
          if (minus < 0){
            m_out.c -= minus
          } else {
            if (linebaroutc < 3){
              m_out.f += minus
            }
          }

          if (nomoM.general(ctimep).length > 1){
            m_out.f += 1
            if (!nomoM.outsidedj.hasOwnProperty(ctimep)){
              nomoM.outsidedj[ctimep] = 2
            } else {
              nomoM.outsidedj[ctimep]++
            }
          }

        }
        else if (djlinktime == 2) {

          //第一根杆
          if (nomoM.general(ctimep2)) {
            if (nomoM.general(ctimep).length == 1&& nomoM.general(ctimep2).length == 1){
              
              var minus = 3 - (gddlinktime * 3 + dxjlinktime * 2 + gdjlinktime * 2 + hdjlinktime * 1)
            
              if (minus < 0){
                m_out.c -= minus
              } else {
                m_out.f += minus
              }

            } else {
              m_out.f += 1
            }
          } else {
            
            m_out.f += 1
          }
     
        } else {

          m_out.f += sm_out.f
        }
   
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

      } else if (linktime == 1 && djlinktime == 1) {
        // 以后要看它是否连接了大地约束，是改变外部还是内部约束
       
        if (nomoM.general(ctimep) && nomoM.general(ctimep).length == 1) {
          var minus = 3 - (gddlinktime * 3 + dxjlinktime * 2 + gdjlinktime * 2 + hdjlinktime * 1)
          
          if (minus < 0){       
            m_out.c -= minus
          } else {
            m_out.f += minus
          }

        } else {
                            
          if (!nomoM.outsidedj.hasOwnProperty(ctimep)){
            nomoM.outsidedj[ctimep] = 2
          } else {
            nomoM.outsidedj[ctimep]++
          } 

          // 第n根杆
          m_out.f += 1
        }
      }

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
              m_in -= trans
            }

            if (nomoM.outsidedj[dj] == 1) {
              delete nomoM.outsidedj[dj]
            }

            nomoM.recover()
          }
        })
      }

      if (this.search.linebar.main(model.p1, m_c) > 2 || this.search.linebar.main(model.p2, m_c) > 2){
        outc += 1
        autodj = true
      }

      outc += gddlinktime * 3 + dxjlinktime * 2 + gdjlinktime * 2 + hdjlinktime * 1

      linkedbarC.recover()

      m_c.push({
        order: model.order
        , category: model.category
        , type: model.type
        , p1: model.p1
        , p2: model.p2
        , outc: outc
        , autodj: autodj
      })

      // 补丁
      if (m_out.f < 0){
        m_out.c -= m_out.f
        m_out.f = 0
      }

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
        , m = this.get(id)
        , m_c = m.get("c")
        , m_in = m.get("in")
        , m_out = m.get("out")
        , outc = 0
        , linebaroutc = this.search.linebar.main(model.p1, m_c, true)
        , ringc = 0

      this.search.linebar.recover()
  
      if (nomoM.marked.hasOwnProperty(model.p1)) nomoM.marked[model.p1] = true

      while(queue&& queue.length > 0) {

        var v =  queue[0]
          , arr = []

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
    
      while (linebaroutc > 3){
        linebaroutc -= 3
        ringc++
      }
    
      if (ring > 0) {
        m_out.f += (ring - ringc - 1)  
      }

      if (ringc > 0) {
        m_out.c -= ringc  
      }

      // 减少内部约束数  
      if (queue) {

        if (m_in == 0){

          m_out.f += (queuelength - ring) 
        } else {
          m_in -= (queuelength - ring)  
        }
      }

      if (ctype == "gdj" || ctype == "hdj" || ctype == "gdd"){

        if (model.bodys.length == 0){
          this.search.dj.getmarked[model.p1] = true
          outc = this.search.dj.getbfs(model.p1, 0, m_c) 
        } else {
          if (!nomoM.zzlinkedlist.find(model.bodys[0]["p1"]) && nomoM.djlinkedlist.find(model.bodys[0]["p1"])){
            if (!nomoM.zzlinkedlist.find(model.bodys[0]["p2"]) && nomoM.djlinkedlist.find(model.bodys[0]["p2"])){
              var bodyp = nomoM.get(model.bodys[0]["p1"]).length >= nomoM.get(model.bodys[0]["p2"]).length ? model.bodys[0]["p2"] : model.bodys[0]["p1"]  
            } else {
              var bodyp = model.bodys[0]["p2"]
            }
          }
          else if (!nomoM.zzlinkedlist.find(model.bodys[0]["p2"]) && nomoM.djlinkedlist.find(model.bodys[0]["p2"])){
            if (!nomoM.zzlinkedlist.find(model.bodys[0]["p1"]) && nomoM.djlinkedlist.find(model.bodys[0]["p1"])){
              var bodyp = nomoM.get(model.bodys[0]["p2"]).length >= nomoM.get(model.bodys[0]["p1"]).length ? model.bodys[0]["p1"] : model.bodys[0]["p2"]  
            } else {
              var bodyp = model.bodys[0]["p1"]
            }
          } else {
            var bodyp = nomoM.zzlinkedlist.find(model.bodys[0]["p1"]) ? model.bodys[0]["p1"] : model.bodys[0]["p2"]
          }

          var anotherp = bodyp == model.bodys[0]["p1"] ? model.bodys[0]["p2"] : model.bodys[0]["p1"]
          
          this.search.dj.getmarked[bodyp] = true
          outc = this.search.dj.getbfs(bodyp, 0, m_c, anotherp) 
        }

        this.search.dj.getrecover()
        
        var f = ctype == "gdj" ? 2 : (ctype == "hdj" ? 1 : 3)
          , result = outc - f
        console.log(outc)
        if (ctype == "gdj"){

          if (result <= -1){
            m_out.f -= 2
          } else if (result == 0){
            m_out.f -= 1
            m_out.c += 1
          } else if (result > 0){
            m_out.c += 2
          } 
        } else if (ctype == "hdj"){
          if (result >= 2){
            m_out.c += 1
          } else {
            m_out.f -= 1
          }
        } else if (ctype == "gdd"){
          if (result == -3){
            m_out.f -= 3
          } else if (result == -2){
            m_out.f -= 2
            m_out.c += 1
          } else if (result == -1){
            m_out.f -= 1
            m_out.c += 2
          } else if (result >= 0){
            m_out.c += 3
          }
        }

        _.each(model.connects,function(connect){

          var p1 = models[connect].p1
            , p2 = models[connect].p2

          // 取得与铰连接的杆的末端
          if (model.bodys.length == 0){

            var p = p1 == model.p1 ? p2 : p1
            var anotherp = p1 == model.p1 ? p1 : p2
          } else {
            if (nomoM.djlinkedlist.find(model.bodys[0]["p1"])&& 
              nomoM.djlinkedlist.find(model.bodys[0]["p2"])&&
              nomoM.get(model.bodys[0]["p1"])&&
              nomoM.get(model.bodys[0]["p2"])){
          
              var p = nomoM.get(model.bodys[0]["p1"]).length >= nomoM.get(model.bodys[0]["p2"]).length ? model.bodys[0]["p1"] : model.bodys[0]["p2"]  
            } else if (nomoM.djlinkedlist.find(model.bodys[0]["p1"])|| nomoM.djlinkedlist.find(model.bodys[0]["p2"])){
            
              var p = nomoM.djlinkedlist.find(model.bodys[0]["p1"]) ? model.bodys[0]["p1"] : model.bodys[0]["p2"]
            } else {
              var p = model.bodys[0]["p1"]
            }            
            var anotherp = p == model.bodys[0]["p2"] ? model.bodys[0]["p1"] : model.bodys[0]["p2"]
          }
          
          thismodel = _.findWhere(m_c,{p1:p1,p2:p2})

          if (ctype == "gdj"){
            thismodel.outc += 2

            this.search.dj.putmarked[anotherp] = true
            m_c = this.search.dj.putbfs(p, m_c, "gdj")  
                        
          } else if (ctype == "hdj"){
            this.search.dj.putmarked[anotherp] = true
            m_c = this.search.dj.putbfs(p, m_c, "hdj")  
            thismodel.outc += 1
          } else if (ctype == "gdd"){
            this.search.dj.putmarked[anotherp] = true
            m_c = this.search.dj.putbfs(p, m_c, "gdd")  
            thismodel.outc += 3
          }
          this.search.dj.putrecover()   

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

      // 补丁
      if (m_out.f < 0){
        m_out.c -= m_out.f
        m_out.f = 0
      }

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

    gdd: function(model, models){
      this.dj(model,'gdd',models)
    },

    dxj: function(model, models){
      this.dj(model,'gdj',models)
    },

    search: {
      linebar:{
        main:function(mainp, m_c, isdj){
          
          // 连接的是单铰或者滑动铰支座
          if ((nomoM.djlinkedlist.find(mainp)&& (!nomoM.zzlinkedlist.find(mainp) || nomoM.hdjlinkedlist.find(mainp)))
            ||(isdj)){        
            return this.getbfs(mainp, m_c)
          } else {
            return 0
          }
        },
        getbfs: function(p, m_c){
          var cnomo = $.extend(true,{}, nomoM.toJSON())   
            , queue = []
            , outc = 0

          this.marked[p] = true

          queue.push(p)

          while (queue.length > 0){

            var v = queue.shift()

            if (cnomo[v] != undefined){

              for (var i = 0;i < cnomo[v].length; i++){
                var w = cnomo[v][i]
                
                if (!this.marked[w]) { 

                  var outc = this.get(v, w, outc, m_c)

                  this.marked[w] = true

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

          if (thismodel){
            outc += thismodel.outc
          }
          
          return outc
        },
        marked:{},
        recover: function(){
          for (var i in this.marked) this.marked[i] = false
        }
      },
      dj: {
        putbfs: function(p, m_c, type){
          var cnomo = $.extend(true,{}, nomoM.toJSON())   
            , queue = []

          this.putmarked[p] = true

          queue.push(p)

          while (queue.length > 0){

            var v = queue.shift()

            if (v !== undefined&& this.put&& nomoM.djlinkedlist.find(v)){
              m_c = this.put(v, m_c, type)
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

        put: function(v, m_c, type){

          _.each(nomoM.get(v),function(p){

            if (this.putmarked[p]){
              return
            }

            var thismodel = _.filter(m_c,function(c){
              return (c.p1 == v && c.p2 == p) || (c.p1 == p && c.p2 == v)
            })[0]

            if (thismodel&& !thismodel.autodj){
              if (type == "gdj"){
                thismodel.outc += 1
                thismodel.autodj = true
              } else if (type == "hdj"){

                if (!thismodel.readydj){
                  thismodel.readydj = true
                } else {
                  thismodel.outc += 1
                  thismodel.autodj = true
                }
              } else if (type == "gdd"){
                thismodel.outc += 2
                thismodel.autodj = true
              }
            }
            
          }.bind(this))   

          return m_c       
        },

        putmarked:{},            

        putrecover: function(){
          for (var i in this.putmarked) this.putmarked[i] = false
        },

        getbfs: function(p, outc, m_c, anotherp){
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

                  var outc = this.get(v, w, outc, m_c, anotherp, p)

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

        get: function(v, w, outc, m_c, anotherp, p){

          var thismodel = _.filter(m_c,function(c){
            return (c.p1 == v && c.p2 == w) || (c.p1 == w && c.p2 == v)
          })[0]

          if (thismodel&& thismodel.outc){
            if (!anotherp){
              outc += thismodel.outc
            } else if (nomoM.djlinkedlist.find(thismodel.p1)&&nomoM.djlinkedlist.find(thismodel.p2)){
                if ((anotherp == thismodel.p1&& p == thismodel.p2)||(anotherp == thismodel.p2&& p == thismodel.p1)){
                  outc += thismodel.outc
                }
            } else {
              outc += thismodel.outc
            }          
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