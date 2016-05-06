define([],function(){

  return function(Set){

    describe("Set", function(){
      var myset = new Set()

      it("add is ok", function(){
        myset.add("zhc")
        myset.add("sy")
        expect(myset.dataStore).to.be.eql(["zhc","sy"])
      })    

      it("remove is ok", function(){
        myset.remove("zhc")
        expect(myset.dataStore).to.be.eql(["sy"])
      })    

      it("size is ok", function(){
        expect(myset.size()).to.be.equal(1)
      })

      it("union is ok", function(){
        var yourset = new Set()

        yourset.add("zhc")

        expect(yourset.union(myset).dataStore).to.be.eql(["zhc","sy"])
      })

      it("intersect is ok", function(){        
        var weset = new Set()

        weset.add("zhc")
        weset.add("sy")

        expect(weset.intersect(myset).dataStore).to.be.eql(["sy"])
      })

      it("subset is ok", function(){
        var weset = new Set()

        weset.add("zhc")
        weset.add("sy")

        expect(myset.subset(weset)).to.be.ok
      })

      it("difference is ok", function(){
        var weset = new Set()

        weset.add("zhc")
        weset.add("sy")

        expect(weset.difference(myset).dataStore).to.be.eql(['zhc'])
      })

    })
  }
})