App.Views.ubar = Backbone.View.extend({
	el: $("#utilitybar"),
	
	template: _.template($('.ubar_tmpl').html()),
	
	initialize: function(){
		var that = this;

		setTimeout(function(){
			that.$el.css("display","block"); 
		},600);
		
		this.listenTo(App.factoryM,"change:type",this.main);
		this.main();	
	},

	events:{
		"keyup" : "postcheck"
	},
	
	postcheck: function(e){
		
		var inputs = this.$el.find("input");	
		
		// 如果keyup不是S键，退出函数
		if (e.which !== 83 &&e.type == "keyup") return ; 
		// 如果utilitybar中没有input元素，退出函数
		if (inputs.length == 0) return ;
		if (e.which == 83 &&(e.target.id == "angle"||e.target.id == "line")) {
			var length = $("#"+e.target.id).val().length,
				num = $("#"+e.target.id).val().slice(0,length-1);
			$("#"+e.target.id).val(num);
		}

		// 对每一个input执行underscore every方法，只要存在不满足条件者，退出函数
		if (!_.every(inputs,every)) return;

		this.post(inputs)
			
		function every(value,key){
			var val = $(value).val();
			// 如果input中无内容，退出函数
			if (val.length == 0) return false;
			// 如果input中都是空格，退出函数
			if (/^\s+$/.test(val)) return false;
			// 如果input不是数字，退出函数
			if (!isNaN(Number(val))) return true;	
		}
			
	},
	
	post: function(inputs){
		var factory = App.factoryM,
			angle,
			barlength;
			
		_.each(inputs,function(input,key){
			var value = Number($(input).val());
			if (input.id == "angle") {
				while (value < 0) {
					value += 360;
				}
				
				while (value > 360) {
					value -= 360;
				}
				
				if (factory.get("type") !== "linebar") {
					factory.set("angle",value);
				} 
				else {
					angle = value;
				}
				
			} else {
				while (value < 0) {
					value = Math.abs(value)	
				}					 	
				barlength = value;                       
			} 
	   });
	   
	   if (factory.get("type") == "linebar") {
		   var kx = Math.cos(Math.PI*angle/180),
			   ky = Math.sin(Math.PI*angle/180),
			   x2 = factory.get("x") + kx*barlength,
			   y2 = factory.get("y") + ky*barlength;
		   
		   if (factory.get("x2")) {
			  factory.set({
				  "x":factory.get("x2"),
				  "y":factory.get("y2")
			  });
			  
			  x2 = factory.get("x") + kx*barlength,
			  y2 = factory.get("y") + ky*barlength;
		   
		   };
		   
		   factory.set({
			   "x2":x2,
			   "y2":y2
		   });
	   }    
											 
		//画约束 和 输入式画杆
		App.factoryM.drawelement();
	},      
						
	main: function(index,type){
		if (!type) {
			var type = App.factoryM.get("type");
		};
		
		var category = App.factoryM.retrRule(type)["category"];
		
		if (category == "constr") {	
			if (type == "dj") {
				this.$el.empty();
				App.factoryM.set("angle",0)
				return;
			}
			this.$el.html(this.template({type:"Angle"}));
		} 
		else if (category == "bar"){
			this.$el.html(this.template({type:"Line&Angle"}));
		} 
		else if (category == "other"){
			this.$el.empty();
		}
	}
})