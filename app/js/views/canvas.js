App.Views.canv = Backbone.View.extend({
	el: $("#canvaswrap"),

	initialize: function(){
		this.listenTo(App.factoryM,"change:type",this.movable)
		this.listenTo(App.singleC,"add",this.presolve)
		this.canvas = this.$el.find("canvas")
		this.drawlib = App.canvdrawV.draw.bind(this)()	
	},

	presolve: function(newmodel){
		var i = 0
			, models = App.singleC.models
			, l  = models.length
			, xy = newmodel.get("category") == "constr" ? {
					"x":newmodel.get("x")
				,	"y":newmodel.get("y")
			} : {
					"x":newmodel.get("x2")
				,	"y":newmodel.get("y2")
			}
	
		App.factoryM.set(xy)

		for (;i<l-1;i++)
			this.$el.find("#canvas").removeLayer('sign'+i)

		App.calbuttonV.viewing = false
		this.connectSolve(newmodel,false)
		this.isCalculate(l,models)
	},

	//当collection中有杆件存在 打开计算功能 没有就关闭
	isCalculate: function(l,models){
		var isCalculate = false
			, i = 0
	
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

	tools:{
			disconnect: function(model1,connects1,order1,model2,connects2,order2){
				model1.set("connects",_.filter(connects1,function(component){
					return component !== order2
				}))

				model2.set("connects",_.filter(connects2,function(component){
					return component !== order1
				}))
			}
		, connect: function(connect1,order1,connect2,order2){
				if (!_.contains(connect1,order2)) 
					connect1.push(order2)
			
				if (!_.contains(connect2,order1)) 
					connect2.push(order1)
		}
		, p2pdistance: function(x1,y1,x2,y2){
				return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
		}
		, p2ldistance: function(k,b,newx,newy){
			return Math.abs((newx - newy/k + b/k)/Math.sqrt(1+1/(k*k)))
		}
		, isp2l: function(x,y,x2,y2,k,b,newx,newy,d){
			return this.region(newx,newy,x,y,x2,y2,d+2,d+2)&&this.p2ldistance(k,b,newx,newy) <= d+2
		}
		, b2bhead: function(x,y,x2,y2,newx,newy,newx2,newy2,d){
				return this.p2pdistance(x,y,newx,newy) <= d ||
						 this.p2pdistance(x2,y2,newx,newy) <= d ||
						 this.p2pdistance(x,y,newx2,newy2) <= d ||						 
						 this.p2pdistance(x2,y2,newx2,newy2) <= d
		}
		, region: function(x,y,regionx1,regiony1,regionx2,regiony2,dx,dy){
				var maxX = regionx1 >= regionx2 ? regionx1 : regionx2
					, minX = maxX == regionx1 ? regionx2 : regionx1
					, maxY = regiony1 >= regiony2 ? regiony1 : regiony2
					, minY = maxY == regiony1 ? regiony2 : regiony1

			return x<=maxX+dx&&y<=maxY+dy&&x>=minX-dx&&y>=minY-dy
		}
	},

	c2b: function(x,y,order,connects,model,newx,newy,newx2,newy2,neworder,newconnects,newmodel){
		if ((x==newx&&y==newy)||(x==newx2&&y==newy2))
			this.tools.connect(connects,order,newconnects,neworder)
		else 
			this.tools.disconnect(model,connects,order,newmodel,newconnects,neworder)
	},

	b2b: function(x,y,x2,y2,k,b,order,connects,type,category,model,newx,newy,newx2,newy2,neworder,newconnects,newmodel,isExist,isnew){
		// 杆端相连
		if (this.tools.b2bhead(x,y,x2,y2,newx,newy,newx2,newy2,0))	{
			this.tools.connect(connects,order,newconnects,neworder)
		}
		else {
			// 杆身相连时，前杆会被断开，所以要从其连接件中删去原来连接的杆
			if (isExist) {
				this.tools.disconnect(model,connects,order,newmodel,newconnects,neworder)
			}
			else if (this.tools.b2bhead(x,y,x2,y2,newx,newy,newx2,newy2,1.5)
				||!(this.tools.region(newx,newy,x,y,x2,y2,0,0)
					||this.tools.region(newx2,newy2,x,y,x2,y2,0,0))) {
				return
			}
			else {	
				var isnew = this.tools.region(newx,newy,x,y,x2,y2,0,0)

				model.set({
						"x2":isnew ? newx : newx2
					,	"y2":isnew ? newy : newy2
				})

				App.singleC.add({
						"type":type
					,	"category":category
					, "x":isnew ? newx : newx2
					, "y":isnew ? newy : newy2
					,	"x2":x2
					,	"y2":y2
					,	"k":k
					,	"b":b	
				},{silent:true})

				// 对杆件连接再处理的杆件不做杆身重合判断
				this.connectSolve(App.singleC.at(order),true)
				this.connectSolve(App.singleC.at(neworder + 1),true)

				// 一根杆与两根杆的杆身相连时的情况
				if (App.singleC.models.length - 2 > neworder){ 
					this.connectSolve(App.singleC.at(neworder + 2),true)
				}
			}
		}
	},
	
	b2c : function(x,y,x2,y2,k,b,order,connects,model,newx,newy,neworder,newconnects,newmodel){
		if (
				// 杆身相连
				this.tools.isp2l(x,y,x2,y2,k,b,newx,newy,6)&&
				this.offset.constr.result&&
				order == this.offset.constr.order||
				// 杆端相连
				((x==newx&&y==newy)||(x2==newx&&y2==newy))
				) {
			this.tools.connect(connects,order,newconnects,neworder)						
		}
	},

	connectSolve: function(newmodel,isExist){
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

		// 第一轮处理
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

			if (order == neworder) return

			if (category == "constr"&&newcategory == "bar") 
				this.c2b(x,y,order,connects,model,newx,newy,newx2,newy2,neworder,newconnects,newmodel)
			else if (category == "bar"&&newcategory == "bar") 
				this.b2b(x,y,x2,y2,k,b,order,connects,type,category,model,newx,newy,newx2,newy2,neworder,newconnects,newmodel,isExist)
			else if (category == "bar"&&newcategory == "constr")
				this.b2c(x,y,x2,y2,k,b,order,connects,model,newx,newy,neworder,newconnects,newmodel)		
		}.bind(this))

		if (isExist) return 
					
		// 第二轮处理
		// 将新杆所连的和它连在同一个约束上的杆去掉
		if (newcategory == "bar") {
			// 经过第一轮处理，newmodel已发生变化
			newconnects = newmodel.get("connects")

			_.each(newconnects,function(connect){
				if (App.singleC.at(connect).get("category") == "constr") {
					constrs.push({
						connects:App.singleC.at(connect).get("connects")
					,	order:App.singleC.at(connect).get("order")
					})
				}
			})

			_.each(constrs,function(constr){
        var constrconnects = constr["connects"]
          , controrder = constr["order"]

        _.each(constrconnects,function(constrconnect){
          var currentconnects = App.singleC.at(constrconnect).get("connects")

          _.each(currentconnects,function(currentconnect){
            var currentmodel = App.singleC.at(currentconnect)
              , currentcategory = currentmodel.get('category')

            if (currentcategory == "bar"&&
              _.contains(currentmodel.get("connects"),controrder)
              ){
              App.singleC.at(constrconnect).set("connects",_.filter(currentconnects,function(connect){
                return connect !== currentconnect
              }))
            }
          })
        })
      })		
		// 将约束的连接件从彼此的连接件中删去	
		} else if (newcategory == "constr") {
			_.each(newconnects,function(connect){
				var connectmodel = App.singleC.at(connect)
					, preconnects = _.filter(newconnects,function(preconnect){
						return preconnect !== connectmodel.get("order")
					})

					connectmodel.set("connects",_.filter(connectmodel.get("connects"),function(currentconnect){
						return !_.contains(preconnects,currentconnect)
					}))
			})	
		}

		this.draw(newmodel)
	},
		
	draw: function(model){
		
		var models = _.map(App.singleC.models,function(model){
			return [
				  model.get("order")
				, model.get("connects")
				, model.get("x")
				, model.get("y")
				, model.get("x2")
				, model.get("y2")
			]
		});

		this.drawlib[model.get("type")](model)
	},
	
	events:{
		"click canvas" : "setCoor"
	},

	offset:{
		constr:{
			result:false
		,	order:null
		}
	},

	setCoor: function(e){
		if ($("canvas").hasClass("moving")) return 

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
			, type = factory.get("type")
			, coinarr = []
			// 防止定向铰和固定端连接在多根杆上
			, bartime = 0
			// 可复用于重合时，将坐标设置为一致，为连接件判断做准备
			, coorSet = function(x,y){
				if (factory.get("x")&&type == "linebar"){
					factory.set({
						"x2":x
					,	"y2":y
					})
				} 
				// 设定约束的坐标或直线的第一个点
				else {					
					factory.set({	
						"x":x
					,	"y":y
					})
				}		
				App.ibarV.postcheck(e)
			}
			this.offset.constr.order = null
			this.offset.constr.result = false
				
		if (
			_.some(App.singleC.models,function(model){
				// 防止两约束重合
				if (model.get("category") == category&&
						category == "constr"&&
						this.tools.p2pdistance(model.get("x"),model.get("y"),X,Y) < 10) {
					return true
				} 
				// 防止多根杆连接在定向铰和固定端上
				else if (category == "bar"&&
						(
							model.get("type") == "gdd"||
							model.get("type") == "dxj"
						)&&						
						(
							this.tools.p2pdistance(X,Y,model.get("x"),model.get("y")) < 5||
							this.tools.p2pdistance(factory.get("x"),factory.get("y"),model.get("x"),model.get("y")) < 5
						)&&
						model.get("connects").length > 0												
				){
					return true
				} 
				// 防止定向铰和固定端连接在多根杆上
				else if (model.get("category") == "bar"&&
						(
							type == "gdd"||
							type == "dxj"
						)&&
						(
							this.tools.p2pdistance(X,Y,model.get("x"),model.get("y")) < 5||
							this.tools.p2pdistance(X,Y,model.get("x2"),model.get("y2")) < 5
						)
				){
					bartime++
					if (bartime > 1) {
						return true
					} 
					else {
						return false
					}
				}
				else {
					return false
				}
		}.bind(this))) return

		_.each(App.singleC.models,function(model){
			var x1 = model.get("x")
				, y1 = model.get("y")
				, d1 = this.tools.p2pdistance(x1,y1,X,Y) < 5 
				, category = model.get("category")
				, order = model.get("order")
				, connects = model.get("connects")
				, x2 = model.get("x2")
				, y2 = model.get("y2")
				, d2 = model.get("x2") ? this.tools.p2pdistance(x2,y2,X,Y) < 5 : undefined
				, coinobj = {}

			if (d1||d2) {
				// 约束或杆件的顶端或末端与之重合 
				coinobj.x = d1 ? x1 : x2
				coinobj.y = d1 ? y1 : y2 
				coinobj.category = category
				coinobj.order = order
				coinarr.push(coinobj)
			}
		}.bind(this))
		
		// 此次点击与多个坐标接近，点击无效
		if (coinarr.length > 0) {
			var maxx = _.max(coinarr,function(model){
				return model.x
			}).x
				, minx = _.min(coinarr,function(model){
				return model.x
			}).x
				, maxy = _.max(coinarr,function(model){
				return model.y
			}).y
				, miny = _.min(coinarr,function(model){
				return model.y
			}).y
			
			if (maxx==minx&&maxy==miny){
				coorSet(coinarr[0].x,coinarr[0].y)
				factory.drawelement() 
			}
		}
		else {
		// 若重合非顶端式重合
		// 通过计算一点到一根直线的垂直距离
		// 判断是否为杆身重合
			// 此次点击与n根杆身接近
			var n = 0
				, pointx
				, pointy
				, preventConnect = false
				
			_.each(App.singleC.models,function(model){
				if (model.get("category") !== "bar") return

				var k = model.get("k")
					, b = model.get("b")
					, x1 = model.get("x")	
					, x2 = model.get("x2")
					, y1 = model.get("y")
					, y2 = model.get("y2")

				if (this.tools.p2ldistance(k,b,X,Y) > 2||
					!this.tools.region(X,Y,x1,y1,x2,y2,4,4)) return 

				n++
			 	// 垂线交点坐标 
			 	pointx = (Y + X/k - b)/(k +1/k)
				pointy = pointx * k + b
				 
				// 约束与杆身连接 偏移约束
				if (_.contains(["gdj","hdj","dj"],type)) {					
					var dx = 6/Math.sqrt(1 + (-1/k)*(-1/k))
						, dy = 6*(-1/k)/Math.sqrt(1 + (-1/k)*(-1/k))
					
					pointx = pointx > X ? pointx - dx : pointx + dx
					pointy = pointy > Y ? pointy - dy : pointy + dy
					this.offset.constr.order = model.get("order")
					this.offset.constr.result = true
				}
				// 防止定向支座和固定端与杆身相连
				if (_.contains(["gdd","dxj"],type)) 
					preventConnect = true
					
			}.bind(this))
			
			if (preventConnect) return
			
			// 此次点击与多根杆身接近，点击无效
			if (n > 1) return
				
			if (n == 1) {
				coorSet(Number(pointx.toFixed(0)),Number(pointy.toFixed(0)))
				factory.drawelement()
			} 
			else {
				coorSet(Number(X.toFixed(0)),Number(Y.toFixed(0)))
				factory.drawelement()
			}
		}
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

	signDraw: function(text,order,signx,signy){
		$(this.canvas).drawText({
			layer:true
		,	name:"sign" + order
		,	visible:true
		,	fillStyle:"seagreen"
		,	x:signx
		, y:signy
		,	fontSize:14
		,	fontFamily: 'Verdana, sans-serif'
		,	text:text
		})
	}
})
