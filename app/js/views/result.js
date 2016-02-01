App.Views.result = Backbone.View.extend({
	el: $("#resultbox"),
	
	template:_.template($(".result_box").html()),

	enter:function(plates){
		this.$el.html(this.template({rc:plates}))
	}
});