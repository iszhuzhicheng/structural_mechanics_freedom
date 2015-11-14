App.Views.canv = Backbone.View.extend({
	el: $("#canvaswrap"),
			
	drawlib:(function(){
		var canvas = $(this.canvas),
			sin = Math.sin,
			cos = Math.cos,
			atan = Math.atan,
			Pi = Math.PI,
			
			//空圆
			blackArc = function(x,y){
				canvas.drawArc({
				   layer:true,
				   strokeWidth:1,
				   strokeStyle: '#fff',
				   fillStyle: '#fff',
				   x: x, y: y,
				   radius: 3.5,
				})
			},
			
			//白圆
			whiteArc = function(x,y){
				canvas.drawArc({
				   layer:true,
				   strokeWidth: 1,
				   strokeStyle: '#df701e',
				   x: x, y: y,
				   radius: 5,
				})
			},
			
			//直线
			drawline = function(x1,y1,x2,y2,color){
				if (!color) {
					var color = '#434343';
				}
				
				canvas.drawLine({
				  layer:true,
				  strokeStyle: color,
				  strokeWidth: 2,
				  x1:x1,y1:y1,
				  x2:x2,y2:y2
			   })
			};
		
		return {
			
			dj: function(model){
				var x = model.get("x"),
					y = model.get("y");
					
				whiteArc(x,y);
				
				 _.each(model.get("connects"),function(num){
					if (App.singleC.models[num].get("category") == "bar" &&
						model.get("type") !== "gdd" &&
						model.get("type") !== "dxj") {
						blackArc(x,y);
					}
				});
			},
			
			linebar: function(model){
				var x1 = model.get("x"),
					y1 = model.get("y"),
					x2 = model.get("x2"),
					y2 = model.get("y2");
					
				drawline(x1,y1,x2,y2);
				
				 _.each(model.get("connects"),function(num){
					var x = App.singleC.models[num].get("x"),
						y = App.singleC.models[num].get("y");
						
					if (App.singleC.models[num].get("category") == "constr" &&
						App.singleC.models[num].get("type") !== "gdd" &&
						App.singleC.models[num].get("type") !== "dxj") {
						blackArc(x,y)
					}
				});

			},
			
			gdj: function(model){
				var x = model.get("x"),
					y = model.get("y"),
					angle = Pi * model.get("angle")/180,
					x2 = x+18*sin(-angle)-10*sin(Pi/2 + angle),
					y2 = y+18*cos(-angle)+10*cos(Pi/2 + angle),
					x3 = x+18*sin(-angle)+10*sin(Pi/2 + angle),
					y3 = y+18*cos(-angle)-10*cos(Pi/2 + angle),
					lx11 = x+4*sin(-angle)+2.5*sin(Pi/2 + angle),
					ly11 = y+4*cos(-angle)-2.5*cos(Pi/2 + angle),
					lx12 = x+12.5*sin(-angle)+7.5*sin(Pi/2 + angle),
					ly12 = y+12.5*cos(-angle)-7.5*cos(Pi/2 + angle),
					lx21 = x+4*sin(-angle)-2.5*sin(Pi/2 + angle),
					ly21 = y+4*cos(-angle)+2.5*cos(Pi/2 + angle),
					lx22 = x+12.5*sin(-angle)-7.5*sin(Pi/2 + angle),
					ly22 = y+12.5*cos(-angle)+7.5*cos(Pi/2 + angle),
					lx31 = x+17.5*sin(-angle)+5.5*sin(Pi/2 + angle),
					ly31 = y+17.5*cos(-angle)-5.5*cos(Pi/2 + angle),
					lx32 = x+17.5*sin(-angle)-5.5*sin(Pi/2 + angle),
					ly32 = y+17.5*cos(-angle)+5.5*cos(Pi/2 + angle),
					lx41 = x-5*sin(angle),
					ly41 = y+5*cos(angle),
					lx42 = x-18*sin(angle),
					ly42 = y+18	*cos(angle),
					lx51 = x+19*sin(-angle)+6*sin(Pi/2 + angle),
					ly51 = y+19*cos(-angle)-6*cos(Pi/2 + angle),
					lx52 = x+19*sin(-angle)-6*sin(Pi/2 + angle),
					ly52 = y+19*cos(-angle)+6*cos(Pi/2 + angle);

				whiteArc(x,y);
				whiteArc(x2,y2);
				whiteArc(x3,y3);
				drawline(lx11,ly11,lx12,ly12,"#5a4283");
				drawline(lx21,ly21,lx22,ly22,"#5a4283");
				drawline(lx31,ly31,lx32,ly32,"#5a4283");
				drawline(lx41,ly41,lx42,ly42,"#5a4283");
				drawline(lx51,ly51,lx52,ly52,"#5a4283");
				
				 _.each(model.get("connects"),function(num){
					if (App.singleC.models[num].get("category") == "bar") {
						blackArc(x,y);
					}
				});
			},
			
			hdj: function(model) {
				var x = model.get("x"),
					y = model.get("y"),
					angle = Pi * model.get("angle")/180,
					x2 = x+18*sin(-angle),
					y2 = y+18*cos(-angle),
					lx11 =  x+5*sin(-angle),
					ly11 = y+5*cos(-angle),
					lx12 = x+12.5*sin(-angle),
					ly12 = y+12.5*cos(-angle),
					lx21 = x+18*sin(-angle)-5*sin(Pi/2 + angle),
					ly21 = y+18*cos(-angle)+5*cos(Pi/2 + angle),
					lx22 = x+18*sin(-angle)-15*sin(Pi/2 + angle),
					ly22 = y+18*cos(-angle)+15*cos(Pi/2 + angle),
					lx31 = x+18*sin(-angle)+5*sin(Pi/2 + angle),
					ly31 = y+18*cos(-angle)-5*cos(Pi/2 + angle),
					lx32 = x+18*sin(-angle)+15*sin(Pi/2 + angle),
					ly32 = y+18*cos(-angle)-15*cos(Pi/2 + angle),
					lx41 = x+20*sin(-angle)+4*sin(Pi/2 + angle),
					ly41 = y+20*cos(-angle)-4*cos(Pi/2 + angle),
					lx42 = x+20*sin(-angle)+15*sin(Pi/2 + angle),
					ly42 = y+20*cos(-angle)-15*cos(Pi/2 + angle),
					lx51 = x+20*sin(-angle)-4*sin(Pi/2 + angle),
					ly51 = y+20*cos(-angle)+4*cos(Pi/2 + angle),
					lx52 = x+20*sin(-angle)-15*sin(Pi/2 + angle),
					ly52 = y+20*cos(-angle)+15*cos(Pi/2 + angle);
				
				whiteArc(x,y);
				whiteArc(x2,y2);
				drawline(lx11,ly11,lx12,ly12,"#5a4283");
				drawline(lx21,ly21,lx22,ly22,"#5a4283");
				drawline(lx31,ly31,lx32,ly32,"#5a4283");
				drawline(lx41,ly41,lx42,ly42,"#5a4283");
				drawline(lx51,ly51,lx52,ly52,"#5a4283");
				
				 _.each(model.get("connects"),function(num){
					if (App.singleC.models[num].get("category") == "bar") {
						blackArc(x,y);
					}
				});
			},
			
			gdd: function(model){
				var x = model.get("x"),
					y = model.get("y"),
					bias= Math.sqrt(7.5*7.5+7.5*7.5),
					angle = Pi * model.get("angle")/180,
					lx11 =  x,
					ly11 = y,
					lx12 = x-15*sin(-angle),
					ly12 = y-15*cos(-angle),
					lx21 = x,
					ly21 = y,
					lx22 = x+15*sin(-angle),
					ly22 = y+15*cos(-angle);
					lx31 = x+7.5*sin(-angle),
					ly31 = y+7.5*cos(-angle),
					lx32 = x+7.5*sin(-angle)+bias*sin(-angle-Pi/4),
					ly32 = y+7.5*cos(-angle)+bias*cos(-angle-Pi/4),
					lx41 = x,
					ly41 = y,
					lx42 = x+bias*sin(-angle-Pi/4),
					ly42 = y+bias*cos(-angle-Pi/4),
					lx51 = x-7.5*sin(-angle),
					ly51 = y-7.5*cos(-angle),
					lx52 = x-7.5*sin(-angle)+bias*sin(-angle-Pi/4),
					ly52 = y-7.5*cos(-angle)+bias*cos(-angle-Pi/4),
					lx61 = x-15*sin(-angle)+bias*sin(-angle-Pi/4),
					ly61 = y-15*cos(-angle)+bias*cos(-angle-Pi/4),
					lx62 = x-15*sin(-angle),
					ly62 = y-15*cos(-angle);
					
				drawline(lx11,ly11,lx12,ly12,"#5a4283");
				drawline(lx21,ly21,lx22,ly22,"#5a4283");
				drawline(lx31,ly31,lx32,ly32,"#5a4283");
				drawline(lx41,ly41,lx42,ly42,"#5a4283");
				drawline(lx51,ly51,lx52,ly52,"#5a4283");
				drawline(lx61,ly61,lx62,ly62,"#5a4283");
			},
			
			dxj: function(model){
				var x = model.get("x"),
					y = model.get("y"),
					angle = Pi * model.get("angle")/180,
					x1 = x+10*sin(-angle),
					y1 = y+10*cos(-angle),
					x2 = x-10*sin(-angle),
					y2 = y-10*cos(-angle),
					x3 = x-25*cos(-angle)-10*sin(-angle),
					y3 = y+25*sin(-angle)-10*cos(-angle),
					x4 = x-25*cos(-angle)+10*sin(-angle),
					y4 = y+25*sin(-angle)+10*cos(-angle),
					lx11 = x+5*sin(-angle),
					ly11 = y+5*cos(-angle),
					lx12 = x-5*sin(-angle),
					ly12 = y-5*cos(-angle),
					lx21 = x-5*cos(-angle)-10*sin(-angle),
					ly21 = y+5*sin(-angle)-10*cos(-angle),
					lx22 = x-20*cos(-angle)-10*sin(-angle),
					ly22 = y+20*sin(-angle)-10*cos(-angle);
					lx31 = x-5*cos(-angle)+10*sin(-angle),
					ly31 = y+5*sin(-angle)+10*cos(-angle),
					lx32 = x-20*cos(-angle)+10*sin(-angle),
					ly32 = y+20*sin(-angle)+10*cos(-angle),
					lx41 = x-25*cos(-angle)+5*sin(-angle),
					ly41 = y+25*sin(-angle)+5*cos(-angle),
					lx42 = x-25*cos(-angle)-5*sin(-angle),
					ly42 = y+25*sin(-angle)-5*cos(-angle),
					lx51 = x-25*cos(-angle)-15*sin(-angle),
					ly51 = y+25*sin(-angle)-15*cos(-angle),
					lx52 = x-25*cos(-angle)-20.5*sin(-angle),
					ly52 = y+25*sin(-angle)-20.5*cos(-angle),
					lx61 = x-25*cos(-angle)+15*sin(-angle),

					ly61 = y+25*sin(-angle)+15*cos(-angle),
					lx62 = x-25*cos(-angle)+20.5*sin(-angle),
					ly62 = y+25*sin(-angle)+20.5*cos(-angle),
					lx71 = x,
					ly71 = y,
					lx72 = x-25*cos(angle),
					ly72 = y-25*sin(angle);
					
					
				whiteArc(x1,y1);
				whiteArc(x2,y2);
				whiteArc(x3,y3);
				whiteArc(x4,y4);
				drawline(lx11,ly11,lx12,ly12,"#5a4283");
				drawline(lx21,ly21,lx22,ly22,"#5a4283");
				drawline(lx31,ly31,lx32,ly32,"#5a4283");
				drawline(lx41,ly41,lx42,ly42,"#5a4283");
				drawline(lx51,ly51,lx52,ly52,"#5a4283");
				drawline(lx61,ly61,lx62,ly62,"#5a4283");
				drawline(lx71,ly71,lx72,ly72,"#5a4283");
			}
	   };
		
	})(),
	
	initialize: function(data){
		this.listenTo(App.factoryM,"change:type",this.movable);
		this.listenTo(App.singleC,"add",this.presolve);
		this.canvas = this.$el.find("canvas");
	},

	presolve: function(newmodel){
		if (newmodel.get("category") == "constr") {
			App.factoryM.set({
				"x":newmodel.get("x"),
				"y":newmodel.get("y")
			});
		} else {
			App.factoryM.set({
				"x":newmodel.get("x2"),
				"y":newmodel.get("y2")
			})
		}
		// 新的构件加入后清除现有的编号
		for (var i=0;i<App.singleC.models.length-1;i++) {
			this.$el.find("#canvas").removeLayer('sign'+i);
		}
		App.calbuttonV.viewing = false;
		this.ConnectSolve(newmodel);
		this.isCalculate();
	},

	//当collection中有杆件存在，打开计算功能，没有就关闭
	isCalculate: function(){
		var isCalculate = false;
		
		if ($("#calcubutton").hasClass("bounceInUp")) {
			$("#calcubutton").removeClass("bounceInUp");
		}

		for (var i=0;i<App.singleC.models.length;i++) {
			if (App.singleC.models[i].get("type") == "linebar") {
				isCalculate = true;
				break;	
			}
		}

		if (isCalculate) {
			App.calbuttonV.enter();
		} else 
			App.calbuttonV.leave();
	},

	ConnectSolve: function(newmodel,isExist){

		var neworder = newmodel.get("order"),
			newcategory = newmodel.get("category"),
			newk = newmodel.get("k"),
			newb = newmodel.get("b"),
			that = this;
		
		//当model和newmodel不是同一个，并且xy坐标相等时，则互为连接件
		
		_.each(App.singleC.models,function(model){
			var category = model.get("category"),
				order = model.get("order");


			//因为此时newmodel已经加入，所以要避免和自己进行比较
			if (order == neworder) return;

			//杆端与约束相连
			if (category == "constr"&&newcategory == "bar") {

				var x = model.get("x"),
					y = model.get("y"),
					x1 = newmodel.get("x"),
					y1 = newmodel.get("y"),
					x2 = newmodel.get("x2"),
					y2 = newmodel.get("y2");
					
				if ((x==x1&&y==y1)||(x==x2&&y==y2))	{
					if (!_.contains(model.get("connects"),newmodel.get("order"))) {
						model.get("connects").push(newmodel.get("order"));
					}
					if (!_.contains(newmodel.get("connects"),model.get("order"))) {
						newmodel.get("connects").push(model.get("order"));
					}
					return;
				}
				else {
					newmodel.set("connects",_.filter(newmodel.get("connects"),function(order){
						return order !== model.get("order");
					}));
					
					model.set("connects",_.filter(model.get("connects"),function(order){
						return order !== newmodel.get("order");
					}));
				}
			}
			// 杆与杆的连接 包括杆端和杆身
			if (category == "bar"&&newcategory == "bar") {
				
				var x1 = model.get("x"),
					y1 = model.get("y"),
					x2 = model.get("x2"),
					y2 = model.get("y2"),
					newx1 = newmodel.get("x"),
					newy1 = newmodel.get("y"),
					newx2 = newmodel.get("x2"),
					newy2 = newmodel.get("y2"),
					k = model.get("k"),
					b = model.get("b"),

					//防止杆端重合
					isnthead = function(){
						var dx1 = Math.abs(x1 - newx1),
							dy1 = Math.abs(y1 - newy1),
							dx2 = Math.abs(x2 - newx2),
							dy2 = Math.abs(y2 - newy2);
						
						if ((dx1<1&&dy1<1)||(dx2<1&&dy2<1)) {
							return false;
						}
						var dx1 = Math.abs(x2 - newx1),
							dy1 = Math.abs(y2 - newy1),
							dx2 = Math.abs(x1 - newx2),
							dy2 = Math.abs(y1 - newy2);
						if ((dx1<1&&dy1<1)||(dx2<1&&dy2<1)) {
							return false;
						}
						return true;
					},
					scale = function(x,y){
						//值域与作用域， 允许5像素以内的误差
			
						var maxX = x1 > x2 ? x1 : x2,
							minX = x1 > x2 ? x2 : x1,
							maxY = y1 > y2 ? y1 : y2,
							minY = y1 > y2 ? y2 : y1;

						if (!(x<maxX+5&&x>minX-5&&y<maxY+5&&y>minY)) return false;

						return true;
					},
					barbody = function(x,y){

						var c = Math.abs(k*x+b-y),
							obj = {
								"type":model.get("type"),
								"category":model.get("category"),
								"x":x,
								"y":y,
								"x2":model.get("x2"),
								"y2":model.get("y2"),
								"k":k,
								"b":b	
							},
							offset = offsetByk(k);
						if (c<offset&&isnthead()&&scale(x,y)&&that.offset.bar) {
							that.offset.bar = false;
							model.set({
								"x2":x,
								"y2":y
							});
							
							if (!isExist) {
						
								App.singleC.add(obj,{silent:true});
							
								// 对杆件连接再处理的杆件不做杆身重合判断
								that.ConnectSolve(App.singleC.at(order),true)
								that.ConnectSolve(App.singleC.at(neworder + 1),true);

								//一根杆与两根杆的杆身相连时的情况
								if (App.singleC.models.length - 2 > neworder) {
									that.ConnectSolve(App.singleC.at(neworder + 2),true)
								};
								
							};
						};
					};
				
				if ((x1==newx1&&y1==newy1)||(x1==newx2&&y1==newy2)||
					(x2==newx1&&y2==newy1)||(x2==newx2&&y2==newy2))	{
					if (!_.contains(model.get("connects"),newmodel.get("order"))) {
						model.get("connects").push(newmodel.get("order"));
					}
					if (!_.contains(newmodel.get("connects"),model.get("order"))) {
						newmodel.get("connects").push(model.get("order"));
					}
					return;
				}
				else {
					if (!isExist) {
						barbody(newx1,newy1);
						barbody(newx2,newy2);	
					} 
					//构件不再相连时，从connects中删去。
					else {
						newmodel.set("connects",_.filter(newmodel.get("connects"),function(order){
							return order !== model.get("order");
						}));
						
						model.set("connects",_.filter(model.get("connects"),function(order){
							return order !== newmodel.get("order");
						}));
						
						return;
					}
				}
			}
				
			if (category == "bar"&&newcategory == "constr") {
				
				var x1 = model.get("x"),
					y1 = model.get("y"),
					x2 = model.get("x2"),
					y2 = model.get("y2"),
					newx1 = newmodel.get("x"),
					newy1 = newmodel.get("y"),
					k = model.get("k"),
					b = model.get("b"),
					vline = {
						k:-1/k,
						b: newy1 + newx1/k
					},
					dx = 6/Math.sqrt(1 + vline.k*vline.k),
					dy = 6*vline.k/Math.sqrt(1 + vline.k*vline.k),
					bodybar = function(x,y,m){
						//值域与作用域， 允许5像素以内的误差
			
						var maxX = x1 > x2 ? x1 : x2,
							minX = x1 > x2 ? x2 : x1,
							maxY = y1 > y2 ? y1 : y2,
							minY = y1 > y2 ? y2 : y1;

						if (!(x<maxX+5&&x>minX-5&&y<maxY+5&&y>minY)) return false;
						
						var c = Math.abs(k*x+b-y),
							offset = offsetByk(k);
						
						//约束还要黏在杆上面同时该杆是点击时的那个点才能算是连接着的
						if (c<offset&&that.offset.constr.result&&order == that.offset.constr.order) {

							if (!_.contains(model.get("connects"),newmodel.get("order"))) {
								model.get("connects").push(newmodel.get("order"));
							}
					
							if (!_.contains(newmodel.get("connects"),model.get("order"))) {
								newmodel.get("connects").push(model.get("order"));
							}
							
							return true;
						} else {
							return false;
						}
					};
					
					//约束和杆身连接
					var pass = bodybar(newx1+dx,newy1+dy);

					if (pass) return;

					pass = bodybar(newx1-dx,newy1-dy);

					if (pass) return;
				
				//约束与杆端相连
				if ((x1==newx1&&y1==newy1)||(x2==newx1&&y2==newy1))	{

					if (!_.contains(model.get("connects"),newmodel.get("order"))) {
						model.get("connects").push(newmodel.get("order"));
					}
					
					if (!_.contains(newmodel.get("connects"),model.get("order"))) {
						newmodel.get("connects").push(model.get("order"));
					}
					
					return;
				}
			}	
		});
		
		//如果新model是杆，遍历它的连接件，如果有约束，得到那个约束的连接件数组，
		//将其中的model的连接件数组中的该新model删去，同时把它们从该新model中删去。
		var newcollects = newmodel.get("connects"),
			category = newmodel.get("category"),
			//constrcollects 是数组。
			constrs = [];
		if (newmodel.get("connects").length>0&&category == "bar") {
			for (var i=0;i<newcollects.length;i++){
				if (App.singleC.at(newcollects[i]).get("category") == "constr") {
					constrs.push({
						collect:App.singleC.at(newcollects[i]).get("connects"),
						order:App.singleC.at(newcollects[i]).get("order")
					});
				}
			}
			
			if (constrs.length > 0) {
				for (var j=0;j<constrs.length;j++){
					var constrcollects = constrs[j]["collect"],
						controrder = constrs[j]["order"];
						
					for (var i=0;i<constrcollects.length;i++){
						var currentcollects = App.singleC.at(constrcollects[i]).get("connects");
														
						_.each(currentcollects,function(num){
							var model = App.singleC.at(num),
								order = model.get("order"),
								category = model.get("category");
							if (category == "bar"&&_.contains(model.get("connects"),controrder)){
								
								currentcollects = _.filter(currentcollects,function(num){
									return num !== order;
								});
								App.singleC.at(constrcollects[i]).set("connects",currentcollects)
							}
						})
					}
				
				}
			}
		}
		
		//如果是约束，遍历它的连接件，如果有多个杆件，就将它们从彼此的连接件数组中删去。
		else if (newmodel.get("connects").length>0&&category == "constr") {
			_.each(newcollects,function(num){
				var model = App.singleC.at(num),
					order = model.get("order"),
					currentcollects = model.get("connects");
					preconnects = _.filter(newcollects,function(num){
						return num !== order;
					});
					currentcollects = _.filter(currentcollects,function(num){
						return !_.contains(preconnects,num)
					});
					model.set("connects",currentcollects);
			})
		};
		
		if (!isExist) {
			this.draw(newmodel)
		};

		//随着k增大，偏移的误差也随着增大	
		function offsetByk(k) {
			return 40 * Math.sqrt(Math.sqrt(Math.abs(k)));
		};

	},
	
	draw: function(model){
		var models = _.map(App.singleC.models,function(model){
			return [model.get("order"),model.get("connects"),model.get("x"),model.get("y"),model.get("x2"),model.get("y2")];
		});
		
		//App.test(models)
		this.drawlib[model.get("type")](model)
	},
	
	events:{
		"click canvas" : "setCoor",
	},

	offset:{
		constr:{
			result:false,
			order:null
		},
		bar:false
	},

	setCoor: function(e){
		if ($("canvas").hasClass("moving")) return ;

		var that = this,
			factory = App.factoryM,
			leftpos = this.$el.css("left").indexOf("px"),
			toppos = this.$el.css("top").indexOf("px"),
			borderpos = this.$el.css("border-width").indexOf("px"),
			borderwidth = Number(this.$el.css("border-width").slice(0,borderpos)),
			// 画布的left偏移等于其父元素的left偏移加上边框宽度
			left = Number(this.$el.css("left").slice(0,leftpos)).integer() + borderwidth, 
			tops = Number(this.$el.css("top").slice(0,toppos)).integer() + borderwidth, 
			// 此次点击的坐标
			X = e.pageX - this.canvas.position().left-left,
			Y = e.pageY - this.canvas.position().top-tops,
			type = factory.get("type"),
			category = factory.get("category"),
			coinarr = [],
			distance = function(x1,x2,y1,y2,l){
				var distance = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
				if (distance >= l) {
					return false;
				} else {
					return true;
				}
			},
			
			// 可复用于重合时，将坐标设置为一致，为连接件判断做准备
			coorSet = function(x,y){

				if (factory.get("x")&& type == "linebar"){
					factory.set({
						"x2":x,
						"y2":y
					});
					return;
				} else {
					//设定约束的坐标或直线的第一个点
					factory.set({	
						"x":x,
						"y":y
					});
				}
				
				if (type == "dj") {	
					return;
				}															  
				App.ubarV.postcheck(e);
			};

		// 一个固定端或定向约束只能与一根杆连接
		if(_.some(App.singleC.models,function(model,index,models){
			if (model.get("type") == "gdd"||model.get("type") == "dxj") {

				// 是否已连接杆件 
				return _.some(model.get("connects"),function(connect){
					if (models[connect].get("type") == "linebar") {
						if (distance(model.get("x"),X,model.get("y"),Y,5)||(
							factory.get("type") == "linebar"
							&&
							!distance(factory.get("x"),X,factory.get("y"),Y,5)
							&&
							distance(model.get("x"),factory.get("x"),model.get("y"),factory.get("y"),5)
						)){
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				});

			} else {
				return false;
			}
		})) {
			return;
		};

		//初始化offset constr
		that.offset.constr.order = null;
		that.offset.constr.result = false;
		
		// 防止两约束相交
		if (App.singleC.models.length > 0) {
			var passcard = _.every(App.singleC.models,function(model){
				var x1 = model.get("x"),
					y1 = model.get("y"),
					d1 = distance(X,x1,Y,y1,10);
				
				if (model.get("category") == category&&category == "constr"&&d1) {
					return false;
				} else {
					return true;
				}
				
			});
		} else {
			var passcard = true;
		}
		
		// 如果两约束重合了就返回
		if (!passcard) return;
		
		_.each(App.singleC.models,function(model){
			var x1 = model.get("x"),
				y1 = model.get("y"),
				d1 = distance(X,x1,Y,y1,5),
				category = model.get("category"),
				order = model.get("order"),
				connects = model.get("connects"),
				x2,
				y2,
				d2;
			
			if (model.get("type") == "linebar") {
				x2 = model.get("x2");
				y2 = model.get("y2");
				d2 = distance(X,x2,Y,y2,5);
			};
			
			// 若重合非两约束式重合
			if (d1||d2) {
				var coinobj = {};
				// 约束或杆件的顶端与之重合
				if (d1) {
					coinobj.x = x1,
					coinobj.y = y1
				// 杆件的末端与之重合
				} else if (d2) {
					coinobj.x = x2,
					coinobj.y = y2
				}   
				coinobj.category = category;
				coinobj.order = order;
				coinarr.push(coinobj);
			};
		});
		
		// 若重合非顶端式重合
		// 通过计算一点到一根直线的垂直距离
		// 判断是否为杆身重合
		if (coinarr.length == 0) {
			var times = 0,
				newline,
				pointx,
				pointy,
				preventConnect = false;
				
			_.each(App.singleC.models,function(model){
				if (model.get("category") !== "bar") return;
				
				//if (type=="gdd"||type=="dxj") return;
				
				var k = model.get("k"),
					b = model.get("b"),
					x1 = model.get("x"),	
					x2 = model.get("x2"),
					y1 = model.get("y"),
					y2 = model.get("y2");
					
				if (Math.abs(k) < 0.0001) {
					if (k<0) {
						k = -0.0001;
					} else {
						k = 0.0001;
					}
				}
				
				if (Math.abs(k) == Infinity) {
					if (k<0) {
						k = -200;
					} else {
						k = 200;
					}
				}
				
				//作用域，允许5像素以内的误差
				if ((X>x1+5&&X>x2+5)||(X<x1-5&&X<x2-5)) return false;
				//值域， 允许5像素以内的误差
				if ((Y>y1+5&&Y>y2+5)||(Y<y1-5&&Y<y2-5)) return false;
				
				var d = Math.abs(-k*X+Y-b)/Math.sqrt(k*k+1);
			
				if (d < 5) {
					times++;
					newline = {
						k:-1/k,
						b:Y + X/k
				 	};
				 	//垂线交点坐标;	 		 
				 	pointx = (newline.b - b)/(k - newline.k),
					pointy = pointx * k + b;
					//杆端与杆身相连，偏移杆端
					if (type == "linebar") {
						that.offset.bar = true;
					};
					 
					//约束与杆身连接 偏移约束
					if (_.contains(["gdj","hdj","dj"],type)) {
						that.offset.constr.order = model.get("order");
						that.offset.constr.result = true;
						var dx = 6/Math.sqrt(1 + newline.k*newline.k),
							dy = 6*newline.k/Math.sqrt(1 + newline.k*newline.k);
						
						if (pointx > X)	{
							pointx = pointx - dx;
							pointy = pointy - dy;
						} else {
							pointx = pointx + dx;
							pointy = pointy + dy;
						}
					};
					//防止定向支座和固定端与杆身相连
					if (_.contains(["gdd","dxj"],type)) {
						preventConnect = true;	
					};
				}
			});
			
			//防止定向支座和固定端与杆身相连
			if (preventConnect) return;
			
			//此次点击与多根杆身接近，点击无效
			if (times > 1) return;
			
			if (times == 1) {
				coorSet(pointx.integer(),pointy.integer());
				factory.drawelement();
			} else {
				coorSet(X,Y);	
			
				factory.drawelement();
				return;	
			}
		}

		// 此次点击与多个坐标接近，点击无效
		
		var maxx = _.max(coinarr,function(model){
			return model.x;
		}).x,
			minx = _.min(coinarr,function(model){
			return model.x;
		}).x,
			maxy = _.max(coinarr,function(model){
			return model.y;
		}).y,
			miny = _.min(coinarr,function(model){
			return model.y;
		}).y;
		
		if (maxx !== minx || maxy !== miny) {
			return false;			
		}
		
		coorSet(coinarr[0].x,coinarr[0].y);	    
		factory.drawelement();      
	},
		
	movable: function(index,value){
		if (value == "move") {
			this.canvas.draggable({ disabled: false });
			this.canvas.css({
				cursor:"-moz-grab",
				cursor: "-webkit-grab"
			});
		} else {
			this.canvas.draggable({ disabled: true });
			this.canvas.css({
				cursor:"crosshair"
			});
		}	
	}, 

	signDraw: function(text,order,signx,signy,signcolor){
		var canvas = $(this.canvas);

		canvas.drawText({
			layer:true,
			name:"sign" + order,
			visible:true,
			fillStyle:signcolor,
			x:signx,y:signy,
			fontSize:14,
			fontFamily: 'Verdana, sans-serif',
			text:text
		})
	}
});