define(['app/model/draw'],function(drawM){
  return new (Backbone.Collection.extend({
    model: drawM,

    url:'http://zhouhansen.github.io/structural_mechanics_freedom/app.json',

    comparator: 'order'
  }))()
})