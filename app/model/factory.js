define(['app/collection/draw'],function(drawC){

  return new (Backbone.Model.extend({
    url : function(){
    },

    defaults: {
      "type": "gdj"
      , "category": "constr"
    },
        
    georule: {
      "constr": ["x", "y", "angle", "order", "connects","bodys"]
      , "bar": ["x", "y", "x2", "y2", "order", "connects","bodys"]
      , "other": []
    },

    newrule: {
      "dj": "constr"
      , "gdj": "constr"
      , "hdj": "constr"
      , "gdd": "constr"
      , "dxj": "constr"
      , "linebar": "bar"
      , "move": "other"
      , "mirror": "constr"
    },

    initialize: function() {
      this.on("change:type", this.clearAtrrs)
    },

    changeType: function(type) {
      this.set("type", type)
      this.set("category", this.newrule[type])
    },

    region: function(x, y, regionx1, regiony1, regionx2, regiony2, dx, dy){
      var maxX = regionx1 >= regionx2 ? regionx1 : regionx2
        , minX = maxX == regionx1 ? regionx2 : regionx1
        , maxY = regiony1 >= regiony2 ? regiony1 : regiony2
        , minY = maxY == regiony1 ? regiony2 : regiony1
        
      return x <= maxX + dx && y <= maxY + dy && x >= minX - dx && y >= minY - dy
    },
    
    kSimilar:function(k){
      var k = Math.abs(k) > 9999 ? (k < 0 ? -10000 : 10000) : k
        , k = Math.abs(k) < 0.0001 ? 0.0001 : k
        
      return Number(k.toFixed(4))
    },

    retrRule: function(type) {
      var newrule = this.newrule
        , georule = this.georule

      return {
        "category": newrule[type]
        , "geodata": georule[newrule[type]]
      }
    },

    clearAtrrs: function(model, type) {
      if (type == "move" || model.previous("type") == "move") return

      // 改变type时，清除之前的几何数据
      var clear = function(value, key) {
        this.unset(value, {
          silent: true
        });
      }.bind(this)

      _.each(["x", "x2", "y", "y2", "angle", "barlength","bodys","connects"], clear);
    },

    passMaker: function(geo) {
      return _.isUndefined(this.get(geo)) ? false : true
    },

    geoGet: function(geo) {
      return this.get(geo)
    },

    // 防止在连在同一根杆上的约束与该杆杆身间再添加新杆
    barbar: function(x, y) {
      var bar = _.filter(drawC.models, function(model) {
        if (model.get("category") == "bar") {
          var x1 = model.get("x")
            , y1 = model.get("y")
            , x2 = model.get("x2")
            , y2 = model.get("y2")

          return !this.region(x, y, x1, y1, x2, y2, 6, 6) ? false : true
        }
      }.bind(this));

      bar = _.map(bar, function(model) {
        return model.get("order");
      });

      return bar ? bar : []
    },

    // 防止在连在同一根杆上的约束间再添加新杆
    barconstr: function(x, y) {
      var constr = _.find(drawC.models, function(model) {
        var category = model.get("category")
          , x1 = model.get("x")
          , y1 = model.get("y")

        return category == "constr" && x1 == x && y1 == y
      }.bind(this))

      if (constr) {

        // 最新添加的杆不参与计算 ** shallow copy will change the backbone array element
        var connects = []

        for (var i = 0; i < constr.get("connects"); i++) {
          connects.push(constr.get("connects")[i])
        }

        connects.pop()

        return connects
      } else {
        return []
      }

    },

    passlineMaker: function(x1, y1, x2, y2) {
      var pass = _.every(drawC.models, function(model) {
        if (model.get("category") == "constr") return true

        var mx1 = model.get("x")
          , my1 = model.get("y")
          , mx2 = model.get("x2")
          , my2 = model.get("y2")

        return (x1 == mx1 && y1 == my1 && x2 == mx2 && y2 == my2) || (x1 == mx2 && y1 == my2 && x2 == mx1 && y2 == my1) ? false : true

      }.bind(this))

      if (!pass) return false

      if (_.intersection(this.barconstr(x1, y1), this.barconstr(x2, y2)).length > 0) return false
      
      if (this.barconstr(x1, y1).length > 0) {
        return _.intersection(this.barbar(x2, y2), this.barconstr(x1, y1)).length > 0 ? false : true
      } else if (this.barconstr(x2, y2).length > 0) {
        return _.intersection(this.barbar(x1, y1), this.barconstr(x2, y2)).length > 0 ? false : true
      }

      return true
    },

    drawelement: function() {
      var type = this.get("type")
        , retr = this.retrRule(type)
        , geodata = retr["geodata"]
        , category = retr["category"]
        , geobj = {
          type: type
          , category: category
        }
        , isgh = (type == "gdj" || type == "hdj")
        , isconstr = (category == "constr")
        , k = isgh ? Math.tan((this.get("angle") - 90) / 180 * Math.PI) : Math.tan((this.get("angle")) / 180 * Math.PI)
        , k = this.kSimilar(k)

      if (!_.every(geodata, this.passMaker.bind(this))) return

      $("input").val("")

      _.extend(geobj
        , _.object(geodata
          , _.map(geodata
            , this.geoGet.bind(this)
          )
        )
      )

      if (isconstr) {
        geobj.k = k

        this.changeType("linebar")

        this.set({
          "x": geobj.x
          , "y": geobj.y
        })

        geobj.p1 = "x" + geobj.x + "y" + geobj.y
        geobj.p2 = null 
   
        drawC.create(geobj)
      }

      if (!this.passlineMaker.bind(this)(geobj.x, geobj.y, geobj.x2, geobj.y2)) return
     
      geobj.k = this.kSimilar((geobj.y2 - geobj.y) / (geobj.x2 - geobj.x))
      geobj.b = geobj.y - geobj.x * geobj.k
      geobj.p1 = "x" + geobj.x + "y" + geobj.y
      geobj.p2 = "x" + geobj.x2 + "y" + geobj.y2 

      // console.log(JSON.stringify(geobj))      

      this.set("bodys",[])
      this.set("connects",[])
      drawC.create(geobj)
    }
  }))()
})
  