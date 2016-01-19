App.Views.calbutton = Backbone.View.extend({
	el:$("#calbutton"),

	initialize:function(){
		var initanime = function(){
			this.$el.css("display","block")
		}.bind(this)

		setTimeout(initanime,100)
	},

	events:{
		"click":"calculate"
	},

	//正在显示中
	viewing:false,

	calculate:function(){
		if (!this.$el.hasClass("btn-danger")) return false

		if (!this.viewing) {
			this.$el.removeClass("btn-danger")
					.addClass("btn-primary")

			this.viewing = true;
			App.singleC.calculate()
		}
	},

	enter:function(){
		if (!this.$el.hasClass("btn-danger")) {
			this.$el.addClass("btn-danger")
					.removeClass("btn-primary")
		}
	},

	leave:function(){
		if (this.$el.hasClass("btn-danger")) {
			this.$el.removeClass("btn-danger")
					.addClass("btn-primary")
		}
	}
});