App.Collections.draw = Backbone.Collection.extend({
  model: App.Models.draw,

  comparator: 'order'
})