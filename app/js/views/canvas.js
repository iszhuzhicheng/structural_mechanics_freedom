App.Views.canv = Backbone.View.extend({
	el: $("#canvaswrap"),

	initialize: function(){
		this.listenTo(App.factoryM,"change:type",this.movable)
		this.listenTo(App.singleC,"add",this.presolve)
		this.canvas = this.$el.find("canvas")
		this.drawlib = App.canvdrawV.draw.bind(this)()	
	},

	setxy: function(model,x,y){
		return {
			"x":model.get(x)
		,	"y":model.get(y)
		}
	},

	presolve: function(newmodel){
		var xy
			, i = 0
			, models = App.singleC.models
			, l  = models.length

		if (newmodel.get("category") == "constr") 
			xy = this.setxy(newmodel,"x","y")
		else 
			xy = this.setxy(newmodel,"x2","y2")
	
		App.factoryM.set(xy)

		for (;i<l-1;i++)
			this.$el.find("#canvas").removeLayer('sign'+i)

		App.calbuttonV.viewing = false
		this.ConnectSolve(newmodel)
		this.isCalculate(l,models)
	},

	//当collection中有杆件存在 打开计算功能 没有就关闭
	isCalculate: function(l,models){
		var isCalculate = false
			, i = 0
		
		App.classTrigger("#calcubutton","bounceInUp",true)
	
		for (;i<l;i++) {
			if (models[i].get("type") == "linebar"){
				isCalculate = true
				break
			}
		}	

		if (isCalculate) 
			App.calbuttonV.enter()
		else 
			App.calbuttonV.leave()
	},

	ConnectSolve: function(newmodel,isExist){
		var neworder = newmodel.get("order")
			, newcategory = newmodel.get("category")
			, newconnects = newmodel.get("connects")
			, newk = newmodel.get("k")
			, newb = newmodel.get("b")
			, newx = newmodel.get("x")
			, newy = newmodel.get("y")
			, newx2 = newmodel.get("x2")
			, newy2 = newmodel.get("y2")
			, constrs = []

		_.each(App.singleC.models,function(model){
			var category = model.get("category")
				,	order = model.get("order")
				, type = model.get("type")
				, connects = model.get("connects")
				, newconnects = newmodel.get("connects")
				,	k = App.kSimilar(model.get("k"))
				,	b = model.get("b")
				, x = model.get("x")
				, y = model.get("y")
				, x2 = model.get("x2")
				, y2 = model.get("y2")
				, vline = {
						k:App.kSimilar(-1/k)
					,	b: newy + newx/k
					}
				, dx = 6/Math.sqrt(1 + vline.k*vline.k)
				, dy = 6*vline.k/Math.sqrt(1 + vline.k*vline.k)

			if (order == neworder) return

			if (category == "constr"&&newcategory == "bar") {
					
				if ((x==newx&&y==newy)||(x==newx2&&y==newy2))	{
					if (!_.contains(connects,neworder)) 
						connects.push(neworder);
				
					if (!_.contains(newconnects,order)) 
						newconnects.push(order);
				}
				else {
					newmodel.set("connects",_.filter(newconnects,function(component){
						return component !== order
					}))

					model.set("connects",_.filter(connects,function(component){
						return component !== neworder
					}))
				}
			}
			if (category == "bar"&&newcategory == "bar") {				
				// 防止杆端重合
				var isnthead = function(){
						var dx1 = Math.abs(x - newx)
							, dy1 = Math.abs(y - newy)
							, dx2 = Math.abs(x2 - newx2)
							, dy2 = Math.abs(y2 - newy2)
						
						if ((dx1<1&&dy1<1)||(dx2<1&&dy2<1)) return false

						var dx1 = Math.abs(x2 - newx)
							, dy1 = Math.abs(y2 - newy)
							, dx2 = Math.abs(x - newx2)
							, dy2 = Math.abs(y - newy2)

						return (dx1<1&&dy1<1)||(dx2<1&&dy2<1) ? false : true
				} , scale = function(x,y){
						//值域与作用域， 允许5像素以内的误差				
						var maxX = x > x2 ? x : x2
							, minX = x > x2 ? x2 : x
							, maxY = y > y2 ? y : y2
							, minY = y > y2 ? y2 : y

						return !(x<maxX+5&&x>minX-5&&y<maxY+5&&y>minY) ? false : true
				} , barbody = function(nx,ny){
						var c = Math.abs(k*x+b-y)
							, obj = {
									"type":type
								,	"category":category
								,	"x":nx
								,	"y":ny
								,	"x2":x2
								,	"y2":y2
								,	"k":k
								,	"b":b	
							} 
							, offset = offsetByk(k)

						if (c<offset&&isnthead()&&scale(nx,ny)&&this.offset.bar) {
							this.offset.bar = false
							model.set({
								"x2":x,
								"y2":y
							})
							
							if (isExist) return 	

							App.singleC.add(obj,{silent:true})

							// 对杆件连接再处理的杆件不做杆身重合判断
							this.ConnectSolve(App.singleC.at(order),true)
							this.ConnectSolve(App.singleC.at(neworder + 1),true)

							//一根杆与两根杆的杆身相连时的情况
							if (App.singleC.models.length - 2 > neworder) 
								this.ConnectSolve(App.singleC.at(neworder + 2),true)
						}
				}.bind(this)
				
				if ((x==newx&&y==newy)||(x==newx2&&y==newy2)||
					(x2==newx&&y2==newy)||(x2==newx2&&y2==newy2))	{
					if (!_.contains(model.get("connects"),newmodel.get("order"))) 
						model.get("connects").push(newmodel.get("order"));

					if (!_.contains(newmodel.get("connects"),model.get("order"))) 
						newmodel.get("connects").push(model.get("order"));

					return;
				}
				else {
					if (!isExist) {
						barbody(newx,newy)
						barbody(newx2,newy2);	
					} 					
					else {
						//构件不再相连时，从connects中删去。
						newmodel.set("connects",_.filter(newmodel.get("connects"),function(order){
							return order !== model.get("order");
						}));
						
						model.set("connects",_.filter(model.get("connects"),function(order){
							return order !== newmodel.get("order");
						}));
						
						return
					}
				}
			}	
			if (category == "bar"&&newcategory == "constr") {				
				var bodybar = function(px,py,m){
						var maxX = x > x2 ? x : x2
							, minX = x > x2 ? x2 : x
							, maxY = y > y2 ? y : y2
							, minY = y > y2 ? y2 : y

						if (!(px<maxX+5&&px>minX-5&&py<maxY+5&&py>minY)) return false;
						
						var c = Math.abs(k*px+b-py)
							, offset = offsetByk(k)
						
						//约束还要黏在杆上面同时该杆是点击时的那个点才能算是连接着的
						if (c<offset&&this.offset.constr.result&&order == this.offset.constr.order) {

							if (!_.contains(model.get("connects"),newmodel.get("order"))) {
								model.get("connects").push(newmodel.get("order"))
							}
					
							if (!_.contains(newmodel.get("connects"),model.get("order"))) {
								newmodel.get("connects").push(model.get("order"))
							}
							
							return true;
						} else {
							return false;
						}
				}.bind(this)
					
				//约束和杆身连接
				if (bodybar(newx+dx,newy+dy)||bodybar(newx-dx,newy-dy)) return;
				
				//约束与杆端相连
				if ((x==newx&&y==newy)||(x2==newx&&y2==newy))	{

					if (!_.contains(model.get("connects"),newmodel.get("order"))) {
						model.get("connects").push(newmodel.get("order"));
					}
					
					if (!_.contains(newmodel.get("connects"),model.get("order"))) {
						newmodel.get("connects").push(model.get("order"));
					}
					
					return
				}
			}	
		}.bind(this))
		
		//如果新model是杆，遍历它的连接件，如果有约束，得到那个约束的连接件数组，
		//将其中的model的连接件数组中的该新model删去，同时把它们从该新model中删去。
		if (newmodel.get("connects").length>0&&newcategory == "bar") {
			for (var i=0;i<newconnects.length;i++){
				if (App.singleC.at(newconnects[i]).get("category") == "constr") {
					constrs.push({
						collect:App.singleC.at(newconnects[i]).get("connects"),
						order:App.singleC.at(newconnects[i]).get("order")
					});
				}
			}
			
			if (constrs.length > 0) {
				for (var j=0;j<constrs.length;j++){
					var constrconnects = constrs[j]["collect"]
						, controrder = constrs[j]["order"]
						
					for (var i=0;i<constrconnects.length;i++){
						var currentconnects = App.singleC.at(constrconnects[i]).get("connects")
														
						_.each(currentconnects,function(num){
							var model = App.singleC.at(num)
								, order = model.get("order")
								, category = model.get("category")
							if (category == "bar"&&_.contains(model.get("connects"),controrder)){								
								currentconnects = _.filter(currentconnects,function(num){
									return num !== order
								})

								App.singleC.at(constrconnects[i]).set("connects",currentconnects)
							}
						})
					}
				}
			}
		}
		else if (newconnects.length>0&&newcategory == "constr") {
			//如果是约束，遍历它的连接件，如果有多个杆件，就将它们从彼此的连接件数组中删去。
			_.each(newconnects,function(num){
				var model = App.singleC.at(num)
					, order = model.get("order")
					, currentconnects = model.get("connects")
					, preconnects = _.filter(newconnects,function(num){
						return num !== order;
					})
					, currentcollects = _.filter(currentconnects,function(num){
						return !_.contains(preconnects,num)
					})

					model.set("connects",currentconnects);
			})
		}
		
		if (isExist) return

		this.draw(newmodel)

		//随着k增大，偏移的误差也随着增大	
		function offsetByk(k) {
			return 40 * Math.sqrt(Math.sqrt(Math.abs(k)));
		}
	},
	
	draw: function(model){
		var models = _.map(App.singleC.models,function(model){
			return [model.get("order"),model.get("connects"),model.get("x"),model.get("y"),model.get("x2"),model.get("y2")]
		});

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

		var factory = App.factoryM
			, leftpos = this.$el.css("left").indexOf("px")
			, toppos = this.$el.css("top").indexOf("px")
			, borderpos = this.$el.css("border-width").indexOf("px")
			, borderwidth = Number(this.$el.css("border-width").slice(0,borderpos))
			// 画布的left偏移等于其父元素的left偏移加上边框宽度
			, left = Number(Number(this.$el.css("left").slice(0,leftpos)).toFixed(0)) + borderwidth
			, tops = Number(Number(this.$el.css("top").slice(0,toppos)).toFixed(0)) + borderwidth
			// 此次点击的坐标
			, X = e.pageX - this.canvas.position().left-left
			, Y = e.pageY - this.canvas.position().top-tops
			, type = factory.get("type")
			, category = factory.get("category")
			, coinarr = []
			, distance = function(x1,x2,y1,y2,l){
				var distance = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
				if (distance >= l) {
					return false
				} else {
					return true
				}
			}
			// 可复用于重合时，将坐标设置为一致，为连接件判断做准备
			, coorSet = function(x,y){

				if (factory.get("x")&& type == "linebar"){
					factory.set({
						"x2":x,
						"y2":y
					})
					return
				} else {
					//设定约束的坐标或直线的第一个点
					factory.set({	
						"x":x,
						"y":y
					});
				}		

				App.ibarV.postcheck(e);
			}

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
							return true
						} else {
							return false
						}
					} else {
						return false
					}
				})
			} else {
				return false
			}
		})) {
			return
		};

		//初始化offset constr
		this.offset.constr.order = null;
		this.offset.constr.result = false;
		
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
		}.bind(this));
		
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
				
				var k = model.get("k")
					, b = model.get("b")
					, x1 = model.get("x")	
					, x2 = model.get("x2")
					, y1 = model.get("y")
					, y2 = model.get("y2")
					, k = App.kSimilar(k)

				if (!App.geoRegion(x1,x2,y1,y2,X,Y,5,5)) return false

				times++
				newline = {
					k:App.kSimilar(-1/k),
					b:Y + X/k
			 	}

			 	// 垂线交点坐标;	 		 
			 	pointx = (newline.b - b)/(k - newline.k);
				pointy = pointx * k + b;

				// 杆端与杆身相连，偏移杆端
				if (type == "linebar") {
					this.offset.bar = true
				}
				 
				// 约束与杆身连接 偏移约束
				if (_.contains(["gdj","hdj","dj"],type)) {
					this.offset.constr.order = model.get("order");
					this.offset.constr.result = true;
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
				// 防止定向支座和固定端与杆身相连
				if (_.contains(["gdd","dxj"],type)) {
					preventConnect = true;	
				}
					
			}.bind(this));
			
			//防止定向支座和固定端与杆身相连
			if (preventConnect) return;
			
			//此次点击与多根杆身接近，点击无效
			if (times > 1) return;
			
			if (times == 1) {
				coorSet(Number(pointx.toFixed(0)),Number(pointy.toFixed(0)));
				factory.drawelement();
			} else {
				coorSet(X,Y)
				factory.drawelement()
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
			this.canvas.draggable({ disabled: false })
			this.canvas.css({
				cursor:"-moz-grab"
			,	cursor: "-webkit-grab"
			})
		} else {
			this.canvas.draggable({ disabled: true })
			this.canvas.css({
				cursor:"crosshair"
			})
		}	
	}, 

	signDraw: function(text,order,signx,signy,signcolor){
		var canvas = $(this.canvas)

		canvas.drawText({
			layer:true
		,	name:"sign" + order
		,	visible:true
		,	fillStyle:signcolor
		,	x:signx,y:signy
		,	fontSize:14
		,	fontFamily: 'Verdana, sans-serif'
		,	text:text
		})
	}
});
