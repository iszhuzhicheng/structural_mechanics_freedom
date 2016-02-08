App.Models.single = Backbone.Model.extend({
	defaults: function(){
		return {
			order: App.singleC.nextOrder(),
			connects:[],
		}
	}
})