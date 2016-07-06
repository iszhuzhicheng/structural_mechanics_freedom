define(['react','reactdom'],function(React, ReactDOM){
  // 计算结果显示区域





  return new (Backbone.View.extend({
    
    el: $("#resultbox"),

    // 好看的色
    colors: ["seagreen", "royalblue", "cadetblue", "blueviolet", "burlywood", "chocolate", "cornflowerblue",
          "crimson", "darkblue", "steelblue", "indianred", "teal", "tan", "tomato", "paleturquoise", "grey"],

    // 结构排序编号
    nextid: 0,

    colorarr: [],

    render:function(models){
       var that = this

       var Structures = React.createClass({
        displayName: "Structures",

        render: function render() {          

          var structures = this.props.data.map(function (structure) {
            var structure = structure.toJSON()

            // 结果由内部约束数、外部约束数，自由度和结构编号四项构成
            return React.createElement(Structure, { inner: structure.in, outc: structure.out.c, outf: structure.out.f, id: structure.id});
          });
          return React.createElement(
            "ul",
            { className: "resultBox" },
            structures
          );
        }
      });

      var Structure = React.createClass({
        displayName: "Structure",

        rawMarkup: function rawMarkup() {
          var rawMarkup = marked(this.props.children.toString(), { sanitize: true });
          return { __html: rawMarkup };
        },

        render: function render() {
          
          if (this.props.id < that.nextid || that.colorarr[this.props.id]){
            var color = that.colorarr[this.props.id]
          } else {
            var color = that.colors[Math.floor(Math.random()*that.colors.length)]
            that.colorarr[this.props.id] = color
            that.nextid = this.props.id
          }          
          return React.createElement(
            "li",
            { className: "structure" , style: { color: color }},
            "结构",
            this.props.id,
            "的内部约束为",
            this.props.inner,
            ",外部约束为",
            this.props.outc,
            ",自由度为",
            this.props.outf
          );
        }
      });
      
      ReactDOM.render(React.createElement(Structures, { data: models }), this.el);

      console.log(JSON.stringify(models))
    }
  }))()
})