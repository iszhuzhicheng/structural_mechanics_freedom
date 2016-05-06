define([],function(){

  return function(List){
    describe("List", function(){
      var list = new List()
      
      it("append is ok",function(){

        list.append("a")
        list.append("b")
        list.append("c")

        expect(list.dataStore).to.be.eql(["a","b","c"])
      })                
    })
  }
})