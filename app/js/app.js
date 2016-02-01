window.App = {
	Models: {},
  Collections: {},
  Views: {},
	start: function(){
		var preloadImages  = ['canvas2',"d","dxj","gdd","gdj","hdj","inputangle","line","linebar","mirror","move"]
		 	, init = function(){			
					this.factoryM = new this.Models.factory()
					this.singleC = new this.Collections.single()
					this.cbarV = new this.Views.cbar()
					this.ibarV = new this.Views.ibar()
					this.canvdrawV = new this.Views.canvdraw()
					this.canvV = new this.Views.canv()
					this.calbuttonV = new this.Views.calbutton()
					this.resultV = new this.Views.result()
					this.bodyV = new this.Views.body()
			}.bind(this)

		Promise.all(preloadImages.map(function(arg){
			return new Promise(function(resolve,reject){
				var image = new Image()

				image.src = "http://zhouhansen.github.io/structural_mechanics_freedom/app/img/" + arg + ".png"

				image.addEventListener("load",function(){
					resolve(arg)
				},false)

				image.addEventListener("error",function(){		
					resolve(arg+"_unloaded")	
				},false)
			})
		})).then(function(imgs){
			var unloads = _.filter(imgs,function(img){
				return /_unloaded/.test(img)																															
			})

			if (unloads.length == 0||unloads.length == preloadImages.length) init()
		})
	},	
		
	kSimilar: function(k){
		var k = Math.abs(k) > 9999 ? (k < 0 ? -10000 : 10000) : k
			,	k = Math.abs(k) < 0.0001 ? 0.0001 : k

		return Number(k.toFixed(4))
	},

	geoRegion: function(x1,x2,y1,y2,x,y,regionx,regiony){
		var maxX = x1 > x2 ? x1 : x2
			, minX = x1 > x2 ? x2 : x1
			,	maxY = y1 > y2 ? y1 : y2
			, minY = y1 > y2 ? y2 : y1
		return x<maxX+regionx&&x>minX-regionx&&y<maxY+regiony&&y>minY-regiony
	},

	geoInterpoint: function(k1,b1,k2,b2){
		return {
			x:Math.abs((b2-b1)/(k2-k1)),
			y:Math.abs((b2-b1)/(k2-k1))*k1 + b1
		}
	},

	geoDistance: function(x1,y1,x2,y2){
		//alert(x1 + " " + y1 + " " + x2 + " " + y2)
		return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1))
	},

	geoDistancein: function(x1,y1,x2,y2,d){
		//alert(this.geoDistance(x1,y1,x2,y2))
		return this.geoDistance(x1,y1,x2,y2) <= d
	},

	geoInterdis: function(x1,y1,k1,b1,k2,b2){
		var interpoint = this.geoInterpoint(k1,b1,k2,b2)
			, x2 = interpoint.x
			, y2 = interpoint.y
		return this.geoDistance(x1,y1,x2,y2)
	},

	pointmatch: function(x1,y1,x2,y2){
		return x1==x2&&y1==y2
	},

	barpointmatch: function(x,x1,x2,y,y1,y2){
		return this.pointmatch(x,y,x1,y1)||this.pointmatch(x,y,x2,y2)
	},

	classTrigger: function(el,cl,has){
		if (has&&$(el).hasClass(cl))
			$(el).removeClass(cl)
	},

	test: function(obj){
		alert(JSON.stringify(obj));
	}
}