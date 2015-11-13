App.Views.calbutton = Backbone.View.extend({
	el:$("#calcubutton"),

	initialize:function(){
		var that = this;

		setTimeout(function(){
			that.$el.css("display","block");    
		},1000);
	},

	events:{
		"click":"calculate"
	},

	//正在显示中
	viewing:false,

	calculate:function(){
		var that = this;

		if (!this.$el.hasClass("active")) {
			return false;
		};

		if (!this.viewing) {
			App.singleC.calculate();
			this.$el.addClass("rotateOut");
			setTimeout(function(){
				that.$el.removeClass("rotateOut");
				that.$el.addClass("rotateIn");
				that.$el.removeClass("active");
			},800);

			this.viewing = true;
		};	
	},

	enter:function(){
		var that = this;

		if (!this.$el.hasClass("active")) {
			this.$el.addClass("rotateOut");

			setTimeout(function(){
				that.$el.removeClass("rotateOut");
				that.$el.addClass("rotateIn");
				that.$el.addClass("active");
			},800);
		}
	},

	leave:function(){
		if (this.$el.hasClass("active")) {
			this.$el.removeClass("active");	
		}
	}
});