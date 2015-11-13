App.Views.body = Backbone.View.extend({
	el: document.body,
	
	events: {
		"keyup":"main",	
	},

	main: function(e){
		// 如果keyup对象不是body，退出函数
		if (e.target.id !== "") return;
		
		if (e.which == 37||e.which == 39){
			App.ebarV.main(e)
		} else if (e.which == 83) {
			App.ubarV.postcheck(e);
		}
		
	},
		
	initialize: function(){
		var bodywidthpos = $("body").css("width").indexOf("px"),
			bodywidth = Number($("body").css("width").slice(0,bodywidthpos));
		
		$("body").css({"font-size": bodywidth/1349 + "px"});	
	}    
})