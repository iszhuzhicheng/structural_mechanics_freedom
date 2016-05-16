define(["reactdom", "react"],function(ReactDOM, react){
  alert(ReactDOM)
  return {
    render:function(models){
      ReactDOM.render(<h1>Hello, world!</h1>,document.getElementById('resultbox'))
      console.log(JSON.stringify(models))
    }
  }
})