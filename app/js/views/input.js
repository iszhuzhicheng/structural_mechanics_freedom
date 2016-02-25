var Input = React.createClass({
  getInitialState: function() {
    return {
      angle: true
    }
  },

  typeChange: function(type) {
    if (type == "gdj" || type == "gdj" || type == "dxj" || type == "gdd")
      this.setState({
        angle: true
        , line: false
      })
    else if (type == "linebar")
      this.setState({
        angle: true
        , line: true
      })
    else
      this.setState({
        angle: false
        , line: false
      })
  },

  render: function() {
    return (
      <div>
        { this.state.angle ? <div className="txt">
          <input type="text" id="angle" placeholder="angle"/>
          <label htmlFor="angle" className="inputangle"></label>
        </div> : null }
        {this.state.line ? <div className="txt">
          <input type="text" id="line" placeholder="line"/>
          <label htmlFor="line" className="inputline"></label>
        </div> : null }
      </div>
    )
  }
})

App.InputRendered = ReactDOM.render(
  <Input />
  , document.getElementById('inputbar')
);