define(['app/model/linkedbar', 'app/model/nomo'],function(linkedbarM, nomoM){

  return new (Backbone.Collection.extend({
    model: linkedbarM,

    modelId: function(attr){
      return attr.order
    },

    initialize: function(){

      this.listenTo(nomoM, "linkedbar", this.main)
      this.on("add",function(model){model.newlinkedbar()})
      this.on("remove",function(){console.log("remove")})
    },

    linebar: function(model){
      // 查找该杆是否与单铰相连
      var p1 = nomoM.djlinkedlist.find(model.p1)
        , p2 = nomoM.djlinkedlist.find(model.p2)
  
      // 直接与两个单铰相连
      if (!_.isNull(p1)&& !_.isNull(p2)){

        this.p1 = model.p1
        this.p2 = model.p2
        this.islinkedbar = true
        this.add({"start": model.p1,"end": model.p2, order: model.p1 + model.p2, used: true})

      } else if (!_.isNull(p1)|| !_.isNull(p2)){

        var start = !_.isNull(p1) ? model.p1 : model.p2
          , end = !_.isNull(p1) ? model.p2 : model.p1
          , order = start + end
          , islinked = false
          , linkbarstart
          , linkbarorder

        this.each(function(linkedbar){   
          var linkedbarlist = linkedbar.get("linkedbar")
            , insertend

          if (linkedbarlist.find(end)){
          
            linkedbarlist.insert(start, "head")

            if (linkedbar.get("used") == true){
              insertend = end == linkedbar.get('start') ? linkedbar.get('end') : linkedbar.get('start')
              linkedbar.set("start",start)
            } else {
              insertend = linkedbar.get('start')
            }

            linkedbar.update(linkedbarlist, insertend)

            if (linkedbar.get("used") == false) {

              linkbarstart = linkedbar.get("start")
              linkbarorder = linkedbar.get("order")
              linkedbar.set("used",true)
              islinked = true
            } else {
              linkedbar.set("used",false)
            }
          }
        }.bind(this))
    
        if (islinked) {
   
          // this.remove(linkbarorder)
          this.p1 = start 
          this.p2 = linkbarstart 
          this.islinkedbar = true
        } else {        
          this.add({"start": start,"end": end, order: order,used: false})
        }
        
      } else if (_.isNull(p1)&& _.isNull(p2)){

        var order1, order2, linked = false, breakit = false , djtime = 0

        this.each(function(linkedbar){

          var linkedbarlist = linkedbar.deepclone(linkedbar.get("linkedbar"))
            , newend

          if (breakit){
            return 
          }

          if (linkedbarlist.find(model.p1)&& linkedbarlist.find(model.p2)) {
            this.p1 = model.p1 
            this.p2 = model.p2 
            this.islinkedbar = true
            breakit = true
            return 
          }
          
          if (linkedbarlist.find(model.p1)) {    
              
            linkedbarlist.insert(model.p2, model.p1)
            newend = model.p2 
            linked = true
            order1 = linkedbar.get('start') + newend

            if (linkedbar.get("used") == false) {
              djtime++            
            }
          } else if (linkedbarlist.find(model.p2)) {
            
            linked = true
            linkedbarlist.insert(model.p1, model.p2)
            newend = model.p1
            order2 = linkedbar.get('start') + newend

            if (linkedbar.get("used") == false) {
              djtime++              
            }
          }  

          if (newend !== undefined){
            linkedbar.update(linkedbarlist, newend)
          }

        }.bind(this))

        if (order1&&order2){
          
          if (djtime >= 2) {

            this.p1 = this.findWhere({"order": order1}).get("start")
            this.p2 = this.findWhere({"order": order2}).get("start")            
            this.islinkedbar = true
          }
          
          var linkedbarlist = this.findWhere({"order": order1}).get("linkedbar")
            , linkedbarlist2 = this.findWhere({"order": order2}).get("linkedbar")
            , currNode = linkedbarlist2.head
            , end = this.findWhere({"order": order1}).get("end")
        
          while (currNode !== null&&currNode.next !== null){

            if ( !linkedbarlist.find(currNode.next.element)){

              linkedbarlist.insert(currNode.next.element,end)
              end = currNode.next.element
            }

            currNode = currNode.next
          }

          // console.log(this.findWhere({"order": order1}).get("end"))
          // 
          // console.log(this.findWhere({"order": order1}).get("end"))

          if (djtime == 0|| djtime >= 2){
            this.findWhere({"order": order1}).set("used",true)
          } else {
            this.findWhere({"order": order1}).set("used",false)
          }


          if (djtime >= 2) {
            this.findWhere({"order": order1}).set("end",this.p2)  
            this.findWhere({"order": order1}).set("order",this.p1 + this.p2)
          } 

          //this.remove(order2) 以及this.get(order2) 这种方便写法不知为何无效了，虽然order2还存在
          this.remove(this.findWhere(function(l){
            return l.get("order") == order2
          }))
              
        
        } else if (!linked){
          this.add({"start": model.p1,"end": model.p2, order: model.p1 + model.p2, used: true})
        }

        //console.log(this.at(0).get("start") + " " + this.at(0).get("end")  + " " + this.at(0).get("order"))

      }

      //console.log(this.models.length)
    },

    dj: function(model){

      var p1 = model.p1
      //console.log(JSON.stringify(this.models))
      if (!nomoM.get(p1)){        
        return 
      }

      if (nomoM.get(p1)&& nomoM.get(p1).length == 1) {

        var linkedbar = this.filter(function(l){
          if (l.get("end") == p1|| l.get("start") == p1){
            return true
          } else if (l.get("linkedbar").find(p1)){
            return true
          }
        })[0]

        linkedbar.set("used",true)

        return 
      }
      // 去掉原先的链杆  
      this.each(function(linkedbar){

        if (linkedbar == undefined) return 

        if (linkedbar.get("linkedbar").find(p1)){

          this.remove(linkedbar.get("order"))
        }
      }.bind(this))

      _.each(nomoM.get(p1),function(p){

        var isdj = nomoM.djlinkedlist.find(p)

        if (isdj){
          
          this.add({"start": p1,"end": p, order: p1 + p, used: true})
        } else {
         // console.log(p)
          this.add({"start": p1,"end": p, order: p1 + p, used: false})

          this.marked[p1] = true

          this.bfs(p, this.get(p1 + p))
          
        }

      }.bind(this))

      for (var i in this.marked) this.marked[i] = false        
    },

    bfs: function(p, linkedbar){
      var queue = []

      this.marked[p] = true

      queue.push(p)

      while (queue.length > 0) {

        var v = queue.shift()

        if (nomoM.get(v) != undefined) {

          for (var i = 0;i < nomoM.get(v).length; i++) {

            var w = nomoM.get(v)[i]
                , linkedbarlist = linkedbar.get("linkedbar")

            if (!this.marked[w]){

              this.marked[w] = true              

              linkedbarlist.insert(w, v)

              linkedbar.update(linkedbarlist, w)         

              if (nomoM.djlinkedlist.find(w)){
                linkedbar.set("used",true)
              } else {                                  
                queue.push(w)
              }
            }
          }
        }
      }
    },

    marked: {},

    main: function(model){

      if (model.type == "linebar"){
        this.linebar(model)
      } else if (model.category == "constr"){
        this.dj(model)
      }
    },

    p1: null,

    p2: null,

    islinkedbar: false,

    recover: function(){
      this.p1 = null
      this.p2 = null
      this.islinkedbar = false
    }

  }))()
})