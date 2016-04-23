define(['app/collection/draw'],function(drawC){

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

      if (!_.isArray(this.get(p1))) this.set(p1,[])
      if (!_.isArray(this.get(p2))) this.set(p2,[])

      if (!_.contains(this.get(p1),p2))  this.set(p1,this.get(p1).concat(p2))
      if (!_.contains(this.get(p2),p1))  this.set(p2,this.get(p2).concat(p1))

      if (!this.marked.hasOwnProperty(p1)) this.marked[p1] = false
      if (!this.marked.hasOwnProperty(p2)) this.marked[p2] = false
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

      if (model.type == "linebar") {
        
        if (model.bodys.length == 2) {

          var p1 = this.instead.hasOwnProperty(model.bodys[0].p1) ? this.instead[model.bodys[0].p1] : model.bodys[0].p1
            , p2 = this.instead.hasOwnProperty(model.bodys[0].p2) ? this.instead[model.bodys[0].p2] : model.bodys[0].p2
            , p3 = this.instead.hasOwnProperty(model.bodys[1].p1) ? this.instead[model.bodys[1].p1] : model.bodys[1].p1
            , p4 = this.instead.hasOwnProperty(model.bodys[1].p2) ? this.instead[model.bodys[1].p2] : model.bodys[1].p2

          if (this.get(p1).length <= this.get(p2).length) {

            this.instead[model.bodys[0].p] = p1
            var remainp1 = p1
          } else {
            this.instead[model.bodys[0].p] = p2
            var remainp1 = p2
          }

          if (this.get(p3).length <= this.get(p4).length) {

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
            
          if (this.get(p1).length <= this.get(p2).length) {
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
            return model.type == "dj"&&(model.p1 == mp1||model.p1 == mp2)&&model.bodys.length > 0
          })

          if (_.isUndefined(djmodel)){

            this.addEdge(mp1,mp2)
          } else {

            var remainp = djmodel.p1 == mp1 ? mp2 : mp1

            if (!this.barbody.hasOwnProperty(remainp)) this.barbody[remainp] = 1
            else this.barbody[remainp]++ 
          }                          
        }
        
        console.log(JSON.stringify(this))
        //console.log(JSON.stringify(model.bodys))
        //console.log(JSON.stringify(this.barbody))
      }
              
      this.trigger('calculate',model)
    },

    dfs: function(v,arr,queue){

      this.marked[v] = true

      if (_.contains(queue,v)) arr.push(v)

      for (var i = 0 ;i < this.get(v).length ;i++) {

        var w = this.get(v)[i]

        if (!this.marked[w]) arr = this.dfs(w,arr,queue)          
      }

      return arr
    },

    recover: function(){
      
      for (var i in this.marked) this.marked[i] = false
    }

  }))()
})