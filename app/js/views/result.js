App.Views.result = Backbone.View.extend({
	el: $("#resultbox"),

	initialize:function(){
		var initanime = function(){
			this.$el.css("display","block"); 
		}.bind(this)

		setTimeout(initanime,100)
	},
	
	template:_.template($(".result_box").html()),

	enter:function(plates){
		this.$el.html(this.template({rc:plates}))
	}
});