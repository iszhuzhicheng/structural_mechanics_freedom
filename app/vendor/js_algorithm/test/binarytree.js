define([],function(){
  return function(BST){
    describe("Binarytree", function(){ 
      var bst = new BST()

      bst.insert(45)
      bst.insert(49)
      bst.insert(27)
      bst.insert(68)
      bst.insert(55)
      bst.insert(44)

      it("getMin is ok", function(){
        expect(bst.getMin()).to.be.equal(27)
      })

      it("getMax is ok", function(){
        expect(bst.getMax()).to.be.equal(68)
      })

      it("find is ok", function(){
        expect(bst.find(44)).to.be.equal(44)
        expect(bst.find(100)).to.be.equal(null)
      })

      it("remove is ok", function(){
        bst.remove(55)
        expect(bst.find(55)).to.be.equal(null)
      })
    })
  }
})