define(['app/model/draw'],function(drawM){
  return new (Backbone.Collection.extend({
    model: drawM,

    url:'http://m.yxgapp.com/d/mooc/GetFocusCourseList.json',

    comparator: 'order'
  }))()
})