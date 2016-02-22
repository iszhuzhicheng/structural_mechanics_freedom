App.Views.body = Backbone.View.extend({
	el: document.body,
	
	events: {
		"keyup":"main"
	},

	initialize: function(){
		["canvV","resultV","cbarV","ibarV"]
		.forEach(function(v){
			App[v].$el.css("display","block")
		})
	},

	main: function(e){
		// 如果keyup对象不是body，退出函数
		if (e.target.id !== "") return
		
		if (e.which == 37||e.which == 39)
			App.cbarV.main(e)
		else if (e.which == 83) 
			App.ibarV.postcheck(e)
	}  
})