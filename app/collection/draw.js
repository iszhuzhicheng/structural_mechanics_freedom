define(['app/model/draw'],function(drawM){

  return new (Backbone.Collection.extend({
    model: drawM,

    comparator: 'order'
  }))()
})