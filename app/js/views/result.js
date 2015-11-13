App.Views.result = Backbone.View.extend({
	el: $("#resultbox"),

	initialize:function(){
		var that = this;
		
		setTimeout(function(){
			that.$el.css("display","block");
			$("#resultboxui").css("display","block");
		},2100);
	},
	
	template:_.template($(".result_box").html()),

	enter:function(plates){
		//App.test(plates);
		this.$el.html(this.template({rc:plates}))
	},

	exit:function(){

	}
});