define([],function(){

  return (Backbone.Router.extend({
    routes:{
      '': 'app',
      'app': 'app',
      'doc/:file': 'doc'
    }
  }))
})