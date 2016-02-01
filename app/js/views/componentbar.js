App.Views.cbar = Backbone.View.extend({
	el: $("#componentbar"),
	
	events: {
		"click div:not(.active)" : "main"
	},
	
	initialize: function(){
		this.listenTo(App.factoryM,"change:type",this.ui);
		this.ui();
	},

	main: function(e){
		var id
			, isClick = e.type === "click"
			, isImgtar = e.target.tagName == "IMG"
			, isLeftarrow = e.which === 37
			, isRightarrow = e.which === 39

		if (isClick&&isImgtar) 
			id = $(e.target).parent().attr("id");
		else if (isClick)
			id = e.target.id;
		else if (isLeftarrow){
		  id = this.$el.find(".active").prev().attr("id")
			if (!id)
				id = this.$el.find(".active").siblings(":last").attr("id")
		}
		else if (isRightarrow) {
			id = this.$el.find(".active").next().attr("id")
			if (!id) 
				id = this.$el.find(".active").siblings(":first").attr("id")
		}

		App.factoryM.changeType(id)
	},
	
	ui: function(model,type){
		if (!type) var type = App.factoryM.get("type")
		
		$("#"+type)
			.addClass("active")
			.siblings()
			.removeClass("active");
	}
})