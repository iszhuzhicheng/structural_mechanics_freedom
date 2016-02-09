window.App = {
	Models: {}
, Collections: {}
, Views: {}
,	start: function(){
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
	}
		
,	kSimilar: function(k){
		var k = Math.abs(k) > 9999 ? (k < 0 ? -10000 : 10000) : k
			,	k = Math.abs(k) < 0.0001 ? 0.0001 : k

		return Number(k.toFixed(4))
	}

,	test: function(obj){
		console.log(JSON.stringify(obj))
	}
}