App.Views.calbutton = Backbone.View.extend({
	el:$("#calbutton"),

	events:{
		"click":"calculate"
	},
	
	//正在显示中
	viewing:false,

	calculate:function(){
		if (!this.$el.hasClass("btn-danger")) return
		App.singleC.calculate()
	},

	enter:function(){
		this.$el.addClass("btn-danger")
						.removeClass("btn-primary")
	},

	leave:function(){
		this.$el.removeClass("btn-danger")
						.addClass("btn-primary")
	}
})