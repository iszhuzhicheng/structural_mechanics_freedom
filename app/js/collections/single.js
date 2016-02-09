App.Collections.single = Backbone.Collection.extend({
	model:App.Models.single,
	
	nextOrder: function(){
		if (!this.length) return 0

		return this.last().get("order") + 1
	},
	
	comparator: 'order',

	initialize: function(){
		_.combine = function(arr1,arr2,strict){
			var arr = []
			_.each(arr1,function(value1){
			  _.each(arr2,function(value2){
				  if (value1 !== value2) {
					var subarr = []
					subarr.push(value1);
					subarr.push(value2);
					if (strict) {
						subarr.reverse()
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
			  })
			})
			return arr
		}
	},
	
	calculate: function(){
		// 为了编号
		var rawdata = App.singleC.models
		// App.test(rawdata)
		var bars = this.where({"category":"bar"})
			, that = this
			// 合成更大刚片的函数数组
			Cals = [			
			   // 杆杆刚接的
			   function(plates,i,j){

				  var newplate = plates[i],
				  	  nextplate = plates[i+j];
				 		
				  // 新刚片的连接件中有下一个刚片的组件
				  // 新刚片的连接件当中的定向支座和固定端连接着下一个刚片的组件 
				  if (
					  _.some(newplate.connects,function(order){
							
						  if (_.contains(nextplate.components,order)) {
							  return true
						  } else if (_.contains(["gdd","dxj"],that.at(order).get("type"))&&
						  	  _.contains(that.at(order).get("connects"),nextplate.components[0])) {
							  return true
						  }
					  })	
				  ){
					  // var connects = _.intersection(newplate.components,nextplate.connects);
					  var union = false
					  
							// if (connects.length >= 1) {
						  var nextcoors = [
							  [that.at(nextplate.components[0]).get("x"),that.at(nextplate.components[0]).get("y")],
							  [that.at(nextplate.components[0]).get("x2"),that.at(nextplate.components[0]).get("y2")]
						  ],
							  newcoors = _.flatten(_.map(newplate.components,function(order){
							  return [
								  [that.at(order).get("x"),that.at(order).get("y")],
								  [that.at(order).get("x2"),that.at(order).get("y2")]
							  ]
						  }),true);
						  
						  newcoors = _.filter(newcoors,function(element,index,list){
							  return !_.isEqual(element,list[index+1])
						  });
						  
						  if (_.every(nextcoors,function(nextcoor){
							  return _.some(newcoors,function(newcoor){
								  return _.isEqual(newcoor,nextcoor)
							  });
						  })) {
							  //回路
							  union = true;	
						  } else {
							  union = false;
						  }
					//}
					  	
					  //将下一个刚片加入到新刚片的多余约束中
					  if (union) {		
						  newplate.innercontrs.push({
							  type:"rigidbar",
							  order:[nextplate.components[0]]
						  });
					  };
					  	
					  // 新刚片的组件与下一个刚片的组件合并
					  newplate.components = _.union(newplate.components,nextplate.components);
					  
					  // 将新刚片的组件从下一个刚片的连接件中去掉
					  nextplate.connects = _.filter(nextplate.connects,function(order){
						  return !_.contains(newplate.components,order);
					  });
					  
					  // 新刚片的连接件与下一个刚片的连接件合并
					  newplate.connects = _.union(newplate.connects,nextplate.connects);
					  
					  // 将下一个刚片的组件从新刚片的连接件中去掉
					  newplate.connects = _.filter(newplate.connects,function(order){
						  return !_.contains(nextplate.components,order);
					  });
					  
					  // 将新刚片的内部约束从新刚片的连接件中去掉
					  newplate.connects = _.filter(newplate.connects,function(order){
						  return !_.contains(_.pluck(newplate.innercontrs,'order'),order);
					  });
					  
					  // 将下一个刚片的内部约束加入新刚片的内部约束
					  _.each(nextplate.innercontrs,function(innnercontr){
					  	  if(!_.contains(_.pluck(newplate.innercontrs,"order"),innnercontr.order)) {
						  	  newplate.innercontrs.push(innnercontr);  
						  }
				      });
					  
					  // 删除斜率；
					  delete newplate.k;

					  // 将下一个刚片从刚片数组中去掉
					  plates.splice(i+j,1)

				  };
				  return plates;
			  },
			  
			  // 一单铰、一链杆
			  function(plates,i,j){
			
				  // 将connects和compontents中的单铰都计入。
			      var newplate = plates[i],
			      	  nextplate = plates[i+j],
			      	  newplatedj = makejd(newplate),
					  nextplatedj = makejd(nextplate);
				 
				   // 获得新刚片内部多余约束
				   // 以下为加入链杆部分	                         
				  
				  var chaindjs = selfchaindjMaker(newplatedj),
				  	  constrplates = [];

			  	  _.each(plates,function(plate){
				      	  
				   	  if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))){
				 		  _.each(chaindjs,function(chaindj){
				 		  	   if (_.isEqual(plate.connects,_.union(plate.connects,chaindj))){
							       
				 				   //组件加入components 		   
				 			   	   newplate.components = _.union(newplate.components,plate.components,chaindj);
				 				   
								   //plate加入多余约束
								   newplate.innercontrs.push({
									   type:"chainbar",
									   order:_.union(plate.components,chaindj)
								   });
								   
				 			   	   //合并多余约束
				 			   	   newplate.innercontrs = _.union(newplate.innercontrs,plate.innercontrs);
				 				   
				 				   //连接件加入connects
				 			   	   newplate.connects = _.union(newplate.connects,plate.connects);
								   
								   //plate的多余约束加入components
							  	   _.each(plate.innercontrs,function(innercontr){
								       newplate.components = _.union(newplate.components,innercontr.order); 	   
							   	   });
								   
								   newplate.connects = _.filter(newplate.connects,function(order){
								   	   if (_.contains(chaindj,order)) {
									       return false;
								   	   } 
									   else {
									   	   return true;
								   	   }
							   	   });
								  
								   constrplates.push(plate.components);
				 			   }
				 		  });
				 	  }

			  	  });
				  
				  plates = _.filter(plates,function(plate){
				  	  if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))){
				      	  return !_.some(constrplates,function(constr){
					     	  return _.isEqual(plate.components,constr)
				      	  });
				  	  } 
					  else {
					  	  return true;
				  	  }
				  });
				  
				  //共有单铰
				  var commondjs = _.intersection(newplatedj,nextplatedj);
				  
				  //取出非共有单铰
				  newplatedj = _.filter(newplatedj,function(order){
					  return !_.contains(commondjs,order);
				  });
				  
				  nextplatedj = _.filter(nextplatedj,function(order){
					  return !_.contains(commondjs,order);
				  });
				  
				  //组成单铰对数组
				  var chaindjs = _.combine(newplatedj,nextplatedj);
				  
				  //如果单铰对数组或共有单铰数组长度为零，则退出本次计算
				  if (chaindjs.length<1||commondjs.length<1) {
					  return plates;
				  };
				  
				  //从共有单铰数组中取出任意一个单铰加入新刚片的组件中
				  var commondj = commondjs.splice(0,1)[0],
				  	  constrplates = [],
				  	  isChain = false;
				  
				  //第一根链杆加入组件之中
				  _.each(plates,function(plate,index){
					  if (isChain) {
						  return ;
					  }
					  
					  // 避免与newplate和nextplate进行不必要的计算
				  	  if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))&&
					  	  !_.isEqual(plate.components,_.union(plate.components,nextplate.components))) {
					       _.each(chaindjs,function(chaindj){
							   // 链杆存在 
						       if (_.isEqual(plate.connects,_.union(plate.connects,chaindj))&&!isChain) {
								   
								   isChain = true;
								   
								   //组件加入components 		   
								   newplate.components = _.union(newplate.components,plate.components,nextplate.components,chaindj);
								   
								   //多余约束加入innercontrs
								   newplate.innercontrs = _.union(newplate.innercontrs,plate.innercontrs,nextplate.innercontrs);
								   
								   //连接件加入connects
								   newplate.connects = _.union(newplate.connects,plate.connects,nextplate.connects);
								   
								   //plate的多余约束加入components
								   _.each(plate.innercontrs,function(innercontr){
									   newplate.components = _.union(newplate.components,innercontr.order); 	   
								   })
								   
								   //nextplate的多余约束加入components
								   _.each(nextplate.innercontrs,function(innercontr){
									   newplate.components = _.union(newplate.components,innercontr.order);
								   });
								   
								   //connects减去共有单铰和单铰链上的单铰
								   newplate.connects = _.filter(newplate.connects,function(order){
									   if (_.contains(chaindj,order)||order == commondj) {
										   return false
									   } else {
										   return true
									   }
								   });
								   
								   constrplates.push(plates[index].components);
								   constrplates.push(plates[i+j].components);
								   
								   //重定义chaindjs
								   newplatedj = makejd(newplate);
								   
								   delete newplate.k;
								   
								   //开启防重模式，筛去单铰相同但顺序相反的单铰对
								   chaindjs = selfchaindjMaker(newplatedj);
								   
								   return
							   }
						   })
						   
					  }
				  })

				  //从plates中移除多余约束的链杆
				  plates = platesFilter()

				  //没有链杆存在，退出本轮计算
				  if (!isChain) {
					  return plates;
				  }
				  
				  if (!_.contains(newplate.components,commondj)){
				  	  newplate.components.push(commondj);
				  }
				  
				  //将其余共有单铰加入新刚片的多余约束中
				  var djcontrs = _.flatten(_.pluck(_.where(newplate.innercontrs,{type:"dj"}),"order"));
				   
			  	  _.each(commondjs,function(commondj){
					  if (!_.contains(djcontrs,commondj)) {
				  	  	  newplate.innercontrs.push({
				  	  	  	  type:"dj",
				      	  	  order:[commondj]    	  				  
				  	  	  });
					  }
			  	  });

				  constrplates = [];
				  
				    // 更多链杆加入多余约束
				    _.each(plates,function(plate){
					    if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))){
					  		_.each(chaindjs,function(chaindj){
								if (_.isEqual(plate.connects,_.union(plate.connects,chaindj))){
									newplate.innercontrs.push({
										type:"chainbar",
										order:_.union(chaindj,plate.components)
									});
									
									newplate.connects = _.union(newplate.connects,plate.connects);
									
									newplate.connects = _.filter(newplate.connects,function(order){
										return !_.contains(chaindj,order);
									});
									
									newplate.components = _.union(newplate.components,_.union(chaindj,plate.components));
									
									//再次重定义chaindjs
								   newplatedj = makejd(newplate);
								   
								   //开启防重模式，筛去单铰相同但顺序相反的单铰对
								   chaindjs = _.combine(newplatedj,newplatedj,true);
								   
								   chaindjs = _.filter(chaindjs,function(chaindj){
									   
									   var dj1connects = that.at(chaindj[0]).get("connects"),
										   dj2connects = that.at(chaindj[1]).get("connects");
										   
									   //单铰对中的两个单铰分别连接的组件中的构件
									   dj1connects = _.intersection(newplate.components,dj1connects);
									   dj2connects = _.intersection(newplate.components,dj2connects);
									   
									   //共同连接着一个构件，则不能作为单铰对
									   if (_.intersection(dj1connects,dj2connects).length > 0) {
										  return false;
									   }
									   else { 
										  return true;
									   }
								   });

								   constrplates.push(plate.components);
								};   
							});     
						}
				    });
				  
				  //从plates中移除多余约束的链杆
				  plates = platesFilter();

				  return plates;

				  function makejd(p) {
					return _.union(
				    	_.filter(p.connects,function(order){
					  		if (_.contains(["hdj","gdj","dj"],that.at(order).get("type"))) return true;
				  	    }),
					    _.filter(p.components,function(order){
					  	    if (_.contains(["hdj","gdj","dj"],that.at(order).get("type"))) return true;
				  	    })
				    );
				  };
				  
				  function selfchaindjMaker(dj){
				      return _.filter(_.combine(dj,dj,true),function(chaindj){
				      	 return true;
				      });  
				  };
				  
				  function platesFilter(){
					  return _.filter(plates,function(plate){
					  	if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))){
					     	 return !_.some(constrplates,function(constr){
						     	return _.isEqual(plate.components,constr)
					      	});
					 	 } else {
						 	 return true;
					  	}
				 	 });  
				  }
			  },
			 
			  //三链杆相连
			   function(plates,i,j){
			  	  var newplate = plates[i],
				  	  nextplate = plates[i+j],
				  	  newplatedjs = makedj(newplate),
				  	  nextplatedjs = makedj(nextplate),
				  	  threes = [];
				  //App.test(plates);
				  
				  //选出三链杆
				  _.each(newplatedjs,function(newplatedj){
				  	_.each(nextplatedjs,function(nextplatedj){
				  		_.each(plates,function(plate,index){
				  			if (!_.isEqual(plate.components,_.union(plate.components,newplate.components))
				  				&&!_.isEqual(plate.components,_.union(plate.components,nextplate.components))) {
				  				if (_.contains(plate.connects,newplatedj)
				  					&&_.contains(plate.connects,nextplatedj)) {
				  					threes.push({
				  						chainbar:plate.components,
				  						dj:[newplatedj,nextplatedj],

				  						//用于合并
				  						whole:_.flatten([newplatedj,nextplatedj,plate.components]),
				  						innercontrs:plate.innercontrs,
				  						connects:_.filter(plate.connects,function(connect){
				  							return !_.contains([newplatedj,nextplatedj],connect)
				  						}),

				  						//用于从plates中去掉
				  						order:index
				  					});
				  				}
				  			}	
				  		})
				  	});
				  });

				  // 不够构成三链杆相连
				  if (threes.length < 3) {
				  	return plates;
				  };

				  // 将从第四根链杆开始的链杆作为多余约束链杆添加。

				  var overbars = []
				  plates = _.map(plates,function(plate){

				  	// 对newplate进行更新
				  	if (_.isEqual(plate,newplate)) {	
				  		for (var i=3;i<threes.length;i++){
				  			plate.innercontrs.push({
				  				"type":"chainbar",
				  				"order":threes[i]["whole"]
				  			});

				  			_.each(plates,function(p,index){
				  				if (p.components == threes[i]["chainbar"]) {
				  					overbars.push(index);
				  				} 
				  			});
				  		}
				  		newplate = plate;
				  	}
				  	return plate;
				  });

				  while(overbars.length>0){
				  	plates.splice(overbars[0],1);
				  	overbars.shift();
				  }
				
				// 开始对plates进行处理
				// 用于过滤dj
				var chaindjs = _.flatten(_.pluck(threes,"dj")),

				 	// 所有的chainbar的order，用于从plates中去掉
				 	chainbar = _.flatten(_.pluck(threes,"chainbar")),

				 	// 用于加入组件
				 	whole = _.flatten(_.pluck(threes,"whole")),

				 	// 用于从plates中删除链杆
				 	orders = _.flatten(_.pluck(threes,"order")),

				 	// 用于将chainbar的连接件与newplate合并
				 	connectofchainbar = _.flatten(_.pluck(threes,"connects"));

				// 将nextplate的index也加入orders 	 
				orders.push(i+j);

				// 将nextplate的connects中的dj过滤掉,用于合并nextplate与newplate的连接件
				nextplate.connects = _.filter(nextplate.connects,function(connect){
					return !_.contains(chaindjs,connect);
				});

				//     将newplate的各个属性更新，之所以对plates使用_.map(),是因为要更新的是包含在plates
				// 中的newplate，之后返回的是plates。
				plates = _.map(plates,function(plate){

				 	// 对 newplate 进行更新
				  	if (_.isEqual(plate,newplate)) {

				  		// 将newplate的connects中的dj过滤掉
				  		plate.connects = _.filter(plate.connects,function(connect){
				  			return !_.contains(chaindjs,connect);
				  		})

				  		delete plate.k;
				  		/*
				  		// 加入链杆至约束
				  		_.each(threes,function(chainbar){
				  			plate.innercontrs.push({
				  				type:"chainbar",
				  				order:chainbar.whole
				  			});
				  		});
						*/
				  		// 加入链杆和nextplate的组件加入至组件
				  		plate.components = _.union(plate.components,whole,nextplate.components); 

				  		plate.components = _.sortBy(plate.components)
				  		
				  		//合并链杆和nextplate的连接件
				  		plate.connects = _.union(plate.connects,connectofchainbar,nextplate.connects);
				  	};

				  	return plate;
				});

				//将链杆和nextplate从plates中去掉
				plates = _.filter(plates,function(plate,index){
					return !_.contains(orders,index);
				})

				return plates;

				function makedj(p) {
					return _.union(
			    	_.filter(p.connects,function(order){
				  		if (that.at(order).get("type") == "dj") return true;
			  	  }),
				    _.filter(p.components,function(order){
				  	  if (that.at(order).get("type") == "dj") return true;
			  	  })
			    )
				}
			  }
		];
		
		//得到基本大刚片
		var plates = platesGet(Cals);
		// App.test(plates);
		function platesGet(Cals){
			//初始化刚片群
			var plates = [];
			
			_.each(bars,function(model){
				var obj = {
					components:[model.get("order")],
					connects:model.get("connects"),
					innercontrs:[],
					k:model.get("k")
				};
				plates.push(obj);
			});
			
			_.each(Cals,function(Cal){
				var i = 0,
					j = 1;

				while (plates.length - 1 > i) {
					var beforeSolve = $.extend(true,[],plates);

					if (i + j <plates.length) {
						plates = Cal(plates,i,j);
					}
					
					if (_.isEqual(beforeSolve,plates)){
						if (i + j < plates.length) {
							j += 1;
						}
						else {
							i += 1;
							j = 1;
						}
					}
					else {
						if (i !== plates.length - 1) {
							i = 0;
							j = 1;
						}
					}
				}
			});
			return plates;
		};

		//准备基本刚片层次上的连接
		plates = _.map(plates,function(plate,index){
			plate.gdd = [];
			plate.gdj = [];
			plate.hdj = [];
			plate.dxj = [];
			plate.platformconstr = 0;

			var allcomps = _.union(plate["components"],plate["connects"])

			_.each(allcomps,function(component){
				if (App.singleC.at(component).get("type") == "gdd") {
					plate.gdd.push(component)
					plate.platformconstr += 3
				} else if (App.singleC.at(component).get("type") == "gdj") {
					plate.gdj.push(component)
					plate.platformconstr += 2
				} else if (App.singleC.at(component).get("type") == "hdj") {
					plate.hdj.push(component)
					plate.platformconstr += 1
				} else if (App.singleC.at(component).get("type") == "dxj") {
					plate.dxj.push(component)
					plate.platformconstr += 2
				}	
			})
			plate.components = _.sortBy(plate.components,function(num){
				return num
			})
			plate.IDconnects = []
			plate.ID = "A"+index
			return plate
		});

		

		//获得由基本大刚片组成的独立结构体
	    plates = platesCenter(plates);

	    function platesCenter(plates){
			var i = 0;
			
			if (plates.length === 0) {
				return;	
			}
			
			// 独立结构体的index不能大于plates的长度
			// 在程序执行过程中，i和plate.length都在变化的，i增加，plate.length减小。
			while (i < plates.length) {
				//代表独立结构体后面的第几个基本刚片
				j = 1;	
				
				// 将第一个基本刚片包装成独立结构体
				newstructBuild();

				while (i+j < plates.length) {
					// 得到后面的基本刚片的构件与连接件合集    
					var unionij = _.union(plates[i+j]["components"],plates[i+j]["connects"]);
					
					// 判断独立结构体与此基本刚片是否相连
					var isConnect = _.some(plates[i],function(plate){
						
						// 独立结构体中的基本刚片的构件与连接件合集
						var unioni = _.union(plate["components"],plate["connects"]);
						
						// 只要有其中一个基本刚片与这个后面的基本刚片相连，那就算是相连的
						if (_.intersection(unionij,unioni).length > 0) {	
							var interconstr = App.singleC.at(_.intersection(unionij,unioni)[0]),
								type = interconstr.get("type");
							
							plate.IDconnects.push({
								"ID":plates[i+j].ID,
								"constrtype":type,
								"constrid":_.intersection(unionij,unioni)[0]
							});

							plates[i+j].IDconnects.push({
								"ID":plate.ID,
								"constrtype":type,
								"constrid":_.intersection(unionij,unioni)[0]
							});

							return true;
						}	
					});
					
					if (isConnect) { 					
						// 将此基本刚片push到此独立结构体中 
						plates[i].push(plates[i+j]);
						plates.splice(i+j,1);
						
						// 重新从后面的第一个基本刚片开始计算
						j = 1		
					} else {
						// 从第j个基本刚片开始计算
						j += 1;	
					}
				}
				
				// 从i+1个基本刚片开始计算
				i+=1;
			}
			
			//将第i个刚片转换为新独立结构体
			function newstructBuild(){
				plates = _.map(plates,function(plate,index){
					if (index === i) {
						return [plate];
					} else {
						return plate;
					}
				});
			}
			return plates;
		}
		
		// 分配共有大地约束

		/*
				当基本大刚片俩俩之间连接着同一个大地约束，
			如果双方的约束数值相等，则保持原样，如果不相等，则将该约束分配到较大的一方，给较小的一方补充一个滚动铰支座,仅仅对
			platformconstr进行改变就够了。
				当基本大刚片俩俩之间连接着单铰，则俩基本大刚片platformconstr 各加1。

		*/

		var constrobj = {
			"hdj":1,
			"gdj":2
		};

		// plate是分结构体

		var plates = _.map(plates,function(plate){
			// 已分配过的基本刚片
			var distributions = [],
				plate = plate;

			_.each(plate,function(basicplate,index,list){
				
				// 此基本刚片尚未分配
				if (!_.contains(distributions,basicplate["ID"])) {

					// 记录该基本刚片ID
					distributions.push(basicplate["ID"]);

					_.each(basicplate["IDconnects"],function(IDconnect){

						//记录与之比较的基本刚片ID
						distributions.push(IDconnect["ID"]);

						var compareplate = _.find(plate,function(childplate){
						    if (childplate["ID"] == IDconnect["ID"]) {
							   	return true;
							};
					    }),
					    	compareplateindex = _.indexOf(plate,compareplate);

						if (IDconnect["constrtype"] == "hdj"||IDconnect["constrtype"] == "gdj") {
							var moti = constrobj[IDconnect["constrtype"]];

							if (basicplate["platformconstr"] > compareplate["platformconstr"]) {
								compareplate["platformconstr"] += 2 - moti;
							} else {
								basicplate["platformconstr"] += 2 - moti;
							}

							//    并没有用到list[index] 和 list[compareplateindex] , 奇怪的是对 basicplate 或者 compareplate
							// 直接进行赋值是失效的，但可以改变其属性。但是现在要做的就只是改变其属性。
									
						} else if (IDconnect["constrtype"] == "dj") {
							if (basicplate["platformconstr"] > compareplate["platformconstr"]) {
								compareplate["platformconstr"] += 2
							} else if (basicplate["platformconstr"] < compareplate["platformconstr"]){
								basicplate["platformconstr"] += 2; 
							} else {
								compareplate["platformconstr"] += 1;
								basicplate["platformconstr"] += 1;
							}
						}

					})
				}		
			});

			return plate;
		});
		
		
		// 进一步包装plates
		var plates = _.map(plates,function(plate){
			var free = 0,
				constr = 0;

			_.each(plate,function(basicplate){
				var freeorc = basicplate.platformconstr - 3;
				if (freeorc>0) {
					constr += freeorc;
				} else if (freeorc<0){
					free += Math.abs(freeorc);
				} else {
					return;
				}
			});

			return {
				freedegree:free,
				constrdegree:constr,
				c:plate
			};
		})

		//定位
		rawdata = _.map(rawdata,function(singlesny){
			var type = singlesny.get("type");

			if (type == "linebar") {
				var signy = (singlesny.get("y") + singlesny.get("y2"))/2 + 8,
					signx = (singlesny.get("x") + singlesny.get("x2"))/2 + 8;

				singlesny.set("signx",signx);			 	
				singlesny.set("signy",signy);		
			}
			else {
				var signy = singlesny.get("y") + 8,
					signx = singlesny.get("x") + 8;

				singlesny.set("signx",signx);			 	
				singlesny.set("signy",signy);
			}
			return singlesny
		})

		App.test(plates)

		var textarrs = _.pluck(plates,"c")

		textarrs = _.map(textarrs,function(textarr){
			textarr = _.pluck(textarr,"components");
			var comarr = [];
			_.each(textarr,function(text){
				comarr.push.apply(comarr,text)
			});
			return comarr
		});

		rawdata = _.map(rawdata,function(raw){
			_.each(textarrs,function(textarr){
				if (_.contains(textarr,raw.get("order"))){
					raw.set("drawtext",_.indexOf(textarr,raw.get("order")));
					return;
				}
			});
			return raw;
		})
		// 绘制
		_.each(rawdata,function(singlesny){
			var text = singlesny.get("drawtext"),
				order = singlesny.get("order"),
				signx = singlesny.get("signx"),
				signy = singlesny.get("signy")

			if (typeof text !== "undefined") {
				App.canvV.signDraw(text,order,signx,signy);		
			}			
		})

		plates = _.map(plates,function(plate){
			var already = 0;
			plate.c = _.map(plate.c,function(constru){
				constru.textcomp = []
				_.each(constru.components,function(comp,index,list){
					constru.textcomp.push(index+already)
					if (index == list.length-1)
						already = index + already + 1
				})
				return constru
			})
			return plate
		})

		// App.test(plates)

		App.resultV.enter(plates)
	}
})