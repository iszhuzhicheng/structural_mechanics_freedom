Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

//四舍五入
Number.method('integer', function(){
	var sma = Math.abs(parseInt(this)-this),
		lar = Math.abs(parseInt(this)+1-this);
	if (sma >= lar) {
   		return parseInt(this) + 1;
	} else {
		return parseInt(this);
	}
});

//检查对象的长度
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

_.combine = function(arr1,arr2,strict){
	var arr = [];
	_.each(arr1,function(value1){
	  _.each(arr2,function(value2){
		  if (value1 !== value2) {
			var subarr = [];
			subarr.push(value1);
			subarr.push(value2);
			if (strict) {
				subarr.reverse();
				if (
				  !_.some(arr,function(sarr){
				   	  return _.isEqual(sarr,subarr);
				  })
				) {
				  arr.push(subarr.reverse());
				}
					
			} else {
				arr.push(subarr);
			}
		  }
	  });
	});
	return arr;
};

_.containarr = function(arr1,arr2) {
	return _.every(arr2,function(value){
		return _.contains(arr1,value)
	});
};

_.minus  = function(arr1,arr2){
	_.each(arr2,function(value){
		if (_.contains(arr1,value)) {
			_.each(arr1,function(value2,key){
				if (value == value2) {
					arr1.splice(key,1);
				}
			});
		};
	});
	return arr1;
};

window.App = {
	Models: {},
  	Collections: {},
  	Views: {},
	start:function(){
		var that = this;

		$("<img/>").attr('src',"http://zhouhansen.github.io/zyd/app/img/canvasborder.png").load(function(){
		  // 预加载图片
		  var preloadImages = [
		    'canvas',
		    'mirror_active',
		    'mirror',
		    'move',
		    'linebar',
		    'dj',
		    'dxj',
		    'gdd',
		    'hdj',
		    'move_active',
		    'linebar_active',
		    'dj_active',
		    'dxj_active',
		    'gdd_active',
		    'gdj_active',
		    'gdj',
		    'hdj_active',
		    'calculate',
		    "calculaten",
		    'elementbarborder',
		    'inputangle',
		    'line'
		  ],
		    count = 0,
		    preloadImageslength = 22;

		  _.each(preloadImages,function(img){
		    $("<img/>").attr('src',"http://zhouhansen.github.io/zyd/app/img/" + img + ".png").load(function(){
		      $(this).remove();

		      count += 1;

		      if (count == preloadImageslength) {
		        init();
		      };
		    });
		  });  

		//断网状态下
		}).error(function(){
			init();
		});

		function init(){
			$(".wrap").css("display","block");
			
		    $('#canvaswrap').addClass("init");

			that.factoryM = new that.Models.factory();
			that.singleC = new that.Collections.single();
			that.bodyV = new that.Views.body();
			that.ebarV = new that.Views.ebar();
			that.ubarV = new that.Views.ubar();
			that.canvV = new that.Views.canv();	
			that.calbuttonV = new that.Views.calbutton();	
			that.resultV = new that.Views.result();
		};
	}
};

App.test = function(obj){
	alert(JSON.stringify(obj));
};