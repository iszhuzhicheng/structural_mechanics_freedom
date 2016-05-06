define([],function(){
  return function(Hash){
    describe("Hash", function(){
      var basichash = new Hash()
        , openchainhash = new Hash("openchain")
        , linearhash = new Hash("linear")
        , names = ["David", "Jennifer", "Donnie", "Raymond", "Cynthia", "Mike", "Clayton", "Danny", "Jonathan", "Zhouhancheng", "Nami"]
        , grades = {"David":88,"Jennifer":68,"Donnie":79,"Raymond":56,"Cynthia":99,"Danny":54,"Jonathan":76,"Zhouhancheng":70,"Nami":9}

      for (var i=0; i<names.length; i++) {
        basichash.put(names[i])
        openchainhash.put(names[i])
        linearhash.put(names[i])
      }

      it ("basic is ok", function(){
        for (var i=0; i<names.length; i++) {          
          expect(basichash.get(names[i])).to.be.equal(names[i])                
        }
      })    

      it("openchain is ok", function(){
        var newarr = []

        for (var i=0; i<names.length; i++){
          newarr.push(openchainhash.get(names[i]))
        }

        expect(newarr).to.be.eql(names)
      })        

      it("openchain_key_value_model is ok", function(){
        var newarr = []

        openchainhash.clear()

        for (var i in grades){
          openchainhash.put(i,grades[i])
          newarr.push(openchainhash.get(i,true))
        }

        expect(newarr).to.be.eql([88,68,79,56,99,54,76,70,9])

      })

      it("linear is ok", function(){
        var newarr = []

        for (var i=0; i<names.length; i++){
          newarr.push(linearhash.get(names[i]))
        }

        expect(newarr).to.be.eql(names)

      })

      it("linear_key_value_model is ok", function(){
        var newarr = []

        linearhash.clear()

        for (var i in grades){
          linearhash.put(i,grades[i])
          newarr.push(linearhash.get(i,true))
        }

        expect(newarr).to.be.eql([88,68,79,56,99,54,76,70,9])

      })
    })
  }
})