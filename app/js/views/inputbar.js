App.Views.ibar = Backbone.View.extend({
	el: $("#inputbar"),
	
	template: _.template($('.ibar_tmpl').html()),

	events:{
		"keyup" : "postcheck"
	},
	
	initialize: function(){
		this.listenTo(App.factoryM,"change:type",this.main)
		this.main()
	},

	main: function(index,type){
		if (!type) 
			var type = App.factoryM.get("type")
		
		var category = App.factoryM.retrRule(type)["category"]
		
		if (category == "constr"&&type !== "dj") 	
			this.$el.html(this.template({type:"Angle"}))
		else if (category == "bar")
			this.$el.html(this.template({type:"Line&Angle"}))
		else if (category == "other")
			this.$el.empty()
	},
	
	postcheck: function(e){		
		var inputs = this.$el.find("input")
			, type = App.factoryM.get("type")
			, isntConstr = App.factoryM.retrRule(type)["category"] !== "constr"

		if ((e.which !== 83 &&e.type == "keyup")||inputs.length == 0) return ; 

		if (e.which == 83 &&(e.target.id == "angle"||e.target.id == "line")) {
			var length = $("#"+e.target.id).val().length
				, num = $("#"+e.target.id).val().slice(0,length-1)

			$("#"+e.target.id).val(num)
		}

		if (!_.every(inputs,validate)) return;

		function validate(value,key){
			var val = $(value).val()
				, isEmpty = val.length == 0||/^\s+$/.test(val)
				, isntNumber = isNaN(Number(val))

			if ((isEmpty&&isntConstr)||isntNumber) return false
			else return true
		}

		this.post(inputs)
	},
	
	post: function(inputs){
		var factory = App.factoryM
			,	angle
			,	barlength
			
		_.each(inputs,function(input,key){
			var value = Number($(input).val())

			if (input.id == "angle") {
				while (value < 0) 
					value += 360
				
				while (value > 360) 
					value -= 360
				
				if (factory.get("type") !== "linebar") 
					factory.set("angle",value)
				else 
					angle = Number(value.toFixed(0))			
			} else {
				while (value < 0) 
					value = Math.abs(value)	
				
				barlength = Number(value.toFixed(0))                  
			} 
	  })
	   
	  if (factory.get("type") == "linebar") {
	    var kx = Math.cos(Math.PI*angle/180)
		    , ky = Math.sin(Math.PI*angle/180)
		    , x2 = factory.get("x") + kx*barlength
		    , y2 = factory.get("y") + ky*barlength
	   	
	    if (factory.get("x2")) {
		    factory.set({
			    "x":factory.get("x2"),
			    "y":factory.get("y2")
		    })
		  
		    x2 = factory.get("x") + kx*barlength
		    y2 = factory.get("y") + ky*barlength
	    }
	   	
	    factory.set({
		    "x2":x2,
		    "y2":y2
	    })
    }    
											 
	  App.factoryM.drawelement()
	},

	clean:function(){
		this.$el.find("input").val("")
	}
})