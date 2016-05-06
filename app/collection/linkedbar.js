define(['app/model/linkedbar','app/model/nomo'],function(linkedbarM, nomoM){

  return new (Backbone.Collection.extend({
    model: linkedbarM,

    modelId: function(attr){
      return 
    },

    initialize: function(){

      this.listenTo(nomoM, "linkedbar", this.main)
    },

    main: function(model){

      // 查找该杆是否与单铰相连
      var p1 = nomoM.djlinkedlist.find(model.p1)
        , p2 = nomoM.djlinkedlist.find(model.p2)

      // 直接与两个单铰相连
      if (!_.isNull(p1)&& !_.isNull(p2)){

        this.p1 = p1.element
        this.p2 = p2.element
        this.islinkedbar = true
      }
              
      // this.create({title:this.models.length})
      // console.log(JSON.stringify(this.models))
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