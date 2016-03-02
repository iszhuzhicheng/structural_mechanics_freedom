define(['react','reactdom'],function(React,ReactDOM){
  var Input = React.createClass({
      displayName: "Input",

      getInitialState: function () {
        return {
          angle: true
        }
      },

      typeChange: function (type) {
        
        if (type == "gdj" || type == "gdj" || type == "dxj" || type == "gdd") {

          this.setState({
            angle: true
            , line: false
          })
        } else if (type == "linebar") {

          this.setState({
            angle: true
            , line: true
          })
        } else {

          this.setState({
            angle: false
            , line: false
          })
        }
      },

      render: function () {

        return React.createElement(
          "div",
          null,
          this.state.angle ? React.createElement(
            "div",
            { className: "txt" },
            React.createElement("input", { type: "text", id: "angle", placeholder: "angle" }),
            React.createElement("label", { htmlFor: "angle", className: "inputangle" })
          ) : null,
          this.state.line ? React.createElement(
            "div",
            { className: "txt" },
            React.createElement("input", { type: "text", id: "line", placeholder: "line" }),
            React.createElement("label", { htmlFor: "line", className: "inputline" })
          ) : null
        )
      }
  })

  return ReactDOM.render(React.createElement(Input, null), document.getElementById('inputbar'))
})
  

  