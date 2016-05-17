define(['app/collection/draw',"js_algorithm/lib/main"],function(drawC, algorithm){

  return new (Backbone.Model.extend({

    initialize: function() {
        this.listenTo(drawC, "add", this.nomo)
    },

    instead:{},

    marked:{},

    outsidedj:{},

    // 杆身相连形成的环
    barbody:{},

    addEdge: function(p1,p2){

      if (!_.isArray(this.general(p1))) this.set(p1,[])
      if (!_.isArray(this.general(p2))) this.set(p2,[])

      if (!_.contains(this.general(p1),p2))  this.set(p1,this.general(p1).concat(p2))
      if (!_.contains(this.general(p2),p1))  this.set(p2,this.general(p2).concat(p1))

      if (!this.marked.hasOwnProperty(p1)){
        this.marked[p1] = false
        this.markedforbfs[p1] = false
      }

      if (!this.marked.hasOwnProperty(p2)){
        this.marked[p2] = false
        this.markedforbfs[p2] = false
      }

    },

    nomo: function(model){

      console.log(JSON.stringify(drawC.models))

      var model = model.toJSON(),
          models = _.map(drawC.models,function(model){
            return model.toJSON()
          })

      var mp1 = this.instead.hasOwnProperty(model.p1) ? this.instead[model.p1] : model.p1
        , mp2 = this.instead.hasOwnProperty(model.p2) ? this.instead[model.p2] : model.p2

      model.bodys = _.filter(model.bodys,function(body){
        if (!_.isUndefined(body)) return true
      })

      model.bodys = _.uniq(model.bodys)

      if (model.type == "linebar") {
        
        if (model.bodys.length == 2) {

          var p1 = this.instead.hasOwnProperty(model.bodys[0].p1) ? this.instead[model.bodys[0].p1] : model.bodys[0].p1
            , p2 = this.instead.hasOwnProperty(model.bodys[0].p2) ? this.instead[model.bodys[0].p2] : model.bodys[0].p2
            , p3 = this.instead.hasOwnProperty(model.bodys[1].p1) ? this.instead[model.bodys[1].p1] : model.bodys[1].p1
            , p4 = this.instead.hasOwnProperty(model.bodys[1].p2) ? this.instead[model.bodys[1].p2] : model.bodys[1].p2

          if (this.general(p1).length <= this.general(p2).length) {

            this.instead[model.bodys[0].p] = p1
            var remainp1 = p1
          } else {
            this.instead[model.bodys[0].p] = p2
            var remainp1 = p2
          }

          if (this.general(p3).length <= this.general(p4).length) {

            this.instead[model.bodys[1].p] = p3
            var remainp2 = p3
          } else {
            this.instead[model.bodys[1].p] = p4
            var remainp2 = p4
          }

          this.addEdge(remainp1,remainp2)
        }        
        else if (model.bodys.length == 1){
          
          var remainp = mp1 == model.bodys[0].p ? mp2 : mp1
            , p1 = this.instead.hasOwnProperty(model.bodys[0].p1) ? this.instead[model.bodys[0].p1] : model.bodys[0].p1
            , p2 = this.instead.hasOwnProperty(model.bodys[0].p2) ? this.instead[model.bodys[0].p2] : model.bodys[0].p2
            
          if (this.general(p1).length <= this.general(p2).length) {
            this.instead[model.bodys[0].p] = p1            
            this.addEdge(remainp,p1)
          } else {
            this.instead[model.bodys[0].p] = p2
            this.addEdge(remainp,p2)
          }
          // console.log(JSON.stringify(model.bodys))
          if (!this.barbody.hasOwnProperty(remainp)) this.barbody[remainp] = 1
          else this.barbody[remainp]++ 
                  
        } 
        else {  
          // 一端连接杆身单铰的情况
          
          var djmodel = _.find(models,function(model){
            return (model.category == "constr")&&(model.p1 == mp1|| model.p1 == mp2)&&model.bodys.length > 0
          })

          if (_.isUndefined(djmodel)){

            this.addEdge(mp1,mp2)
          } else {

            var remainp = djmodel.p1 == mp1 ? mp2 : mp1

            if (!this.barbody.hasOwnProperty(remainp)) this.barbody[remainp] = 1
            else this.barbody[remainp]++ 
          }                          
        }        
        
      }

      //console.log(JSON.stringify(this))
      //console.log(JSON.stringify(this.instead))
      //console.log(JSON.stringify(model.bodys))
      //console.log(JSON.stringify(this.barbody))
      this.trigger('linkedbar',model)
      
      this.trigger('calculate',{model:model, models:models})
    },

    dfs: function(v,arr,queue){

      this.marked[v] = true

      if (_.contains(queue,v)) arr.push(v)

      for (var i = 0 ;i < this.general(v).length ;i++) {

        var w = this.general(v)[i]

        if (!this.marked[w]) arr = this.dfs(w,arr,queue)          
      }

      return arr
    },

    recover: function(){
      
      for (var i in this.marked) this.marked[i] = false
    },

    general: function(id){
      if (this.get(id)){
        return this.get(id)
      } else{
        return this.get(this.instead[id])
      }
    },

    // 查找两点间有多少条不交叉的路径，通道上有多少铰
    getPj: function(p1, p2){

      // 'copynomo = this.toJSON()' 是浅复制，会改变this的值
      var copynomo = $.extend(true,{}, this.toJSON()) 
      
      if (copynomo[p1] == undefined){
        var p1 = this.instead[p1]
      }

      if (copynomo[p2] == undefined){
        var p2 = this.instead[p2]
      }
      
      var index1 = copynomo[p1].indexOf(p2)
        , index2 = copynomo[p2].indexOf(p1)
        , pathNum = 0
        , djNum = 0
        , increaseInner

      copynomo[p1].splice(index1, 1)
      copynomo[p2].splice(index2, 1)

      this.bfs(p1, copynomo)

      var path = this.pathTo(p1,p2)

      while (path.length > 0){

        pathNum++

        _.each(path,function(p){

          if (this.djlinkedlist.find(p)){
            djNum++
          }

          var intersections = _.intersection(copynomo[p],path)

          _.each(intersections,function(intersection){

            var index = copynomo[intersection].indexOf(p)

            if (index != -1){
              copynomo[intersection].splice(index, 1)
            }

            if (copynomo[intersection].length == 0){
              delete copynomo[intersection]
            }
          })

          delete copynomo[p]

        }.bind(this))

        this.recoverforbfs()

        this.bfs(p1, copynomo)        

        path = this.pathTo(p1,p2)
        
      }

      this.recoverforbfs()

      increaseInner = djNum + 1 <= pathNum

      console.log(djNum + " " + pathNum)

      return increaseInner
    },

    bfs: function(p1, cnomo, func){
      var queue = []

      this.markedforbfs[p1] = true

      queue.push(p1)

      while (queue.length > 0) {
        
        var v = queue.shift()

        if (v !== undefined&& func) {
          func(v)
        }

        if (cnomo[v] != undefined) {

          for (var i = 0;i < cnomo[v].length; i++) {

            var w = cnomo[v][i]

            if (!this.markedforbfs[w]) {
              this.edgeTo[w] = v
              this.markedforbfs[w] = true
              queue.push(w)
            }

          }
        }
      }
    },

    pathTo: function(start, end){
      var source = start
        , path = []

      if (!this.hasPathTo(end)) {
        return []
      }

      for (var i = end; i != source; i = this.edgeTo[i]) {

        if (i == null){
          break
        }

        if (i !== end) {
          path.push(i)
        }
      }

      //path.push(source)

      return path      
    },

    hasPathTo: function(v){
      return this.markedforbfs[v]
    },

    edgeTo:{},

    markedforbfs: {},

    recoverforbfs:  function(){
      
      for (var i in this.markedforbfs) this.markedforbfs[i] = false

      this.edgeTo = {}  
    },

    insertdj: function(child, parent){      
      if (!this.djlinkedlist.find(child)){
        
        this.djlinkedlist.insert(child, parent)
      }
    },

    insertzz: function(child, parent){      
      if (!this.zzlinkedlist.find(child)){
        
        this.zzlinkedlist.insert(child, parent)
      }
    },

    inserthdj: function(child, parent){      
      if (!this.hdjlinkedlist.find(child)){
        
        this.hdjlinkedlist.insert(child, parent)
      }
    },

    djlinkedlist: new algorithm.linkedlist.SingleLList(),

    zzlinkedlist: new algorithm.linkedlist.SingleLList(),

    hdjlinkedlist: new algorithm.linkedlist.SingleLList()

  }))()
})