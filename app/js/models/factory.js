App.Models.factory = Backbone.Model.extend({
	defaults: function(){
		return {
			"type":"gdj",
			"category":"constr"
		}					
	},
	
	rule: {
		"constr" : {
			"type":["dj","gdj","hdj","gdd","dxj"],
			"geodata":["x","y","angle"]
		},
		
		"bar" : {
			"type":["linebar"],
			"geodata":["x","y","x2","y2"]
		},
		
		"other" : {
			"type":["move","mirror"],
			"geodata":[]
		}
	},
	
	changeType: function(type){
		var that = this;
		this.set("type",type);
			
		_.each(this.rule,function(category,key){
			if (_.contains(category["type"],type)) {
				that.set("category",key);
			}
		});
	},
	
	retrRule: function(type) {
		var rule = this.rule;
		
		for (var i in rule) {
			if (_.contains(rule[i]["type"],type)) {
				return {
					"category" : i,
					"geodata" :	rule[i]["geodata"]
				};
			}
		}
	},
	
	cleardatas: ["x","x2","y","y2","angle","barlength"],
	
	initialize: function(){
		this.on("change:type",this.clearAtrrs);				
	},

	clearAtrrs: function(model,type){
		//如果type或上一个type是拖动，不清除工厂数据
		if (type == "move"||model.previous("type") == "move") {
			return;
		}
		
		//改变type时，清除之前的几何数据
		var that = this;
		
		_.each(this.cleardatas,function(value,key){
			that.unset(value,{silent:true});
		});
	},
	
	drawelement: function(){
		
		var type = this.get("type"),
			retr = this.retrRule(type),
			geodata = retr["geodata"],
			category = retr["category"],
			that = this,
			//绘图所需要的值全都齐了才行
			passCard = _.every(geodata,function(num){	
				// 屏蔽默认0为false
				if (that.get(num) == 0) return true;
						
				return that.get(num)
			}),
			geobj = {
				type:type,
				category:category
			};
		
		if (passCard) {

			// 通过后，清除input中的值
			App.ubarV.$el.find("input").val("");
			
			_.each(geodata,function(value,key){
				geobj[value] = that.get(value);
			});
			
			//当通过的是约束，ebar跳转到直线。同时设置直线的第一个坐标
			if (retr["category"] == "constr") {
				var x = this.get("x"),
					y = this.get("y");
				
				if (type == "gdj"||type == "hdj") {
					geobj.k = Math.tan((this.get("angle") - 90)/180*Math.PI);
				} else if (type == "gdd"||type == "dxj") {
					geobj.k = Math.tan((this.get("angle"))/180*Math.PI);
				}
				
				if (Math.abs(geobj.k) > 199) {
					if (geobj.k<0) {
						geobj.k = -200;
					} else {
						geobj.k = 200;
					}
				};
				
				if (Math.abs(geobj.k) < 0.001) {
						geobj.k = 0;
				}
																					 
				this.changeType("linebar")
				
				this.set({"x":x,"y":y});
			};
			
			// 计算直杆的k和b
			// model为杆件，而且两端点均与已有杆件相等则退出函数,防止杆件重合
			if (type == "linebar") {

				if (
					(function(x1,y1,x2,y2){
						//防止在连在同一根杆上的约束间再添加新杆
						if (_.intersection(barconstr(x1,y1),barconstr(x2,y2)).length>0){
							return false;
						};

						//防止在连在同一根杆上的约束与该杆杆身间再添加新杆
						if (barconstr(x1,y1).length > 0) {
							var constrconnect = barconstr(x1,y1),
								barx = x2,
								bary = y2;
						} 
						else if (barconstr(x2,y2).length > 0) {
							var constrconnect = barconstr(x2,y2),
								barx = x1,
								bary = y1;
						} 
						else {
							return true;
						};

						if (_.intersection(barbar(barx,bary),constrconnect).length>0){
							return false;
						} else {
							return true;
						}

						function barconstr(x,y){
							var constr = _.filter(App.singleC.models,function(model){
								return model.get("x") == x && model.get("y") == y && model.get("category") == "constr";
							})[0];

							if (constr) {
								return constr.get("connects");
							} else {
								return [];
							};
						};

						function barbar(x,y){	
							var bar = _.filter(App.singleC.models,function(model){
								if (model.get("category") == "bar") {
									var x1 = model.get("x"),
										y1 = model.get("y"),
										x2 = model.get("x2"),
										y2 = model.get("y2");

									//值域与作用域， 允许5像素以内的误差
			
									var maxX = x1 > x2 ? x1 : x2,
										minX = x1 > x2 ? x2 : x1,
										maxY = y1 > y2 ? y1 : y2,
										minY = y1 > y2 ? y2 : y1;

									if (!(x<maxX+5&&x>minX-5&&y<maxY+5&&y>minY)) return false;

									var k = (y2 - y1)/(x2 - x1);

									if (Math.abs(k) == Infinity||Math.abs(k) > 200) {
										if (k<0) {
											k = -200;
										} else {
											k = 200;
										}
									};

									var b = y1 - x1*k,
										c = Math.abs(k*x+b-y);
									if (Math.abs(k)<2) {
										var allowoffset = 10;
									}
									else if (Math.abs(k)>=1.5&&Math.abs(k)<5) {
										var allowoffset = 20;
									}
									else if (Math.abs(k)>=5&&Math.abs(k)<20) {
										var allowoffset = 30;
									}
									else if (Math.abs(k)>=20&&Math.abs(k)<50) {
										var allowoffset = 50;
									}
									else if (Math.abs(k)>=50&&Math.abs(k)<100) {
										var allowoffset = 80;
									}
									else if (Math.abs(k)>=100&&Math.abs(k)<=200) {
										var allowoffset = 100;
									}

									if (c<allowoffset) {
										return true;
									}
								}
							});

							bar = _.map(bar,function(model){
								return model.get("order");
							});
						
							if (bar) {
								return bar;
							} else {
								return [];
							};

						};
					})(geobj.x,geobj.y,geobj.x2,geobj.y2)
				) {

					geobj.k = (geobj.y2-geobj.y)/(geobj.x2-geobj.x);
					
					if (Math.abs(geobj.k) == Infinity) {
						if (geobj.k<0) {
							geobj.k = -200;
						} else {
							geobj.k = 200;
						}
					};
					
					geobj.b = geobj.y - geobj.x*geobj.k;
					
					var passcard = _.every(App.singleC.models,function(model){
						var order = model.get("order"),
							category  = model.get("category");

						if (category == "constr") return true;
						
						var x1 = model.get("x"),
							y1 = model.get("y"),
							x2 = model.get("x2"),
							y2 = model.get("y2");
						
						if ((x1==geobj.x&&y1==geobj.y&&x2==geobj.x2&&y2==geobj.y2)||
							(x1==geobj.x2&&y1==geobj.y2&&x2==geobj.x&&y2==geobj.y)) {
							return false;
						} else {
							return true;
						}
					})
					
					if (!passcard) return ;
				} else {
					return;
				}
			};
			
			// 单体集合中加入一个来自工厂的model
			App.singleC.create(geobj);
			return;
		}
		
	},
})