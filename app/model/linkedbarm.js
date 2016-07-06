define(["js_algorithm/lib/main"],function(algorithm){
  // 链表的model

            
  return (Backbone.Model.extend({

    initialize: function(){
      this.on("change",function(){})
    },

    newlinkedbar: function(){
      var linkedbar = new algorithm.linkedlist.SingleLList()

      linkedbar.insert(this.get('start'),"head")
      linkedbar.insert(this.get('end'),this.get('start'))

      this.set("linkedbar",linkedbar)
    },

    update: function(linkedbar,end){
      this.set({
        "linkedbar": linkedbar
        , "end": end
        , "order": this.get("start") + end
      })
    },

    deepclone: function(oldlinkedbar){
      var linkedbar = new algorithm.linkedlist.SingleLList()
        , currNode = oldlinkedbar.head

      while(currNode.next !== null){

        linkedbar.insert(currNode.next.element,currNode.element)

        currNode = currNode.next        
      }

      return linkedbar
    }

  }))
})