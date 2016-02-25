App.Collections.single = Backbone.Collection.extend({
  model: App.Models.single,

  comparator: 'order'
})