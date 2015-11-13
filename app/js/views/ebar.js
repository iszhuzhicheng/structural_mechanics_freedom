App.Views.ebar = Backbone.View.extend({
	el: $("#elementbar"),
	
	events: {
		"click div:not(.active)" : "main",
	},
	
	main: function(e){
		if (e.type === "click") {
			var id = e.target.id;
		} else {
			if (e.which === 37){
				var id = this.$el.find(".active").prev().attr("id");
				if (typeof id == "undefined") {
					id = this.$el.find(".active").siblings(":last").attr("id")
				}
			}
			else if (e.which === 39) {
				var id = this.$el.find(".active").next().attr("id");
				if (typeof id == "undefined") {
					id = this.$el.find(".active").siblings(":first").attr("id")
				}
			}
		};
		App.factoryM.changeType(id)
		
	},
	
	ui: function(model,type){
		if (!type) {
			var type = App.factoryM.get("type");
		};
		
		$("#"+type).addClass("active")
				   .siblings()
				   .removeClass("active");
	},

	initialize: function(){
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
 		var isFirefox = typeof InstallTrigger !== 'undefined'; 
  		var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  		var isChrome = !!window.chrome && !isOpera;              
  		var isIE = false || !!document.documentMode; 
  		var that = this;

  		if (isSafari||isFirefox) {
   			this.$el.css({
        		"width":"300px"
    		});
  		};

  		setTimeout(function(){
  			that.$el.css("display","block");
  		},300);


		this.listenTo(App.factoryM,"change:type",this.ui);
		this.ui();
	}
});




























