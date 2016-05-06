define([],function(){
  return function(Linkedlist){
    describe("Linkedlist", function(){ 

      describe("SingleLList", function(){

        it("insert is ok", function(){
          var singleLList = new Linkedlist.SingleLList()
            , str = ""

          singleLList.insert("Jordan","head")  
          singleLList.insert("Lebron","Jordan")
          singleLList.insert("Kobe","Jordan")
          singleLList.insert("Durrant","Lebron")

          var currNode = singleLList.head

          while (!(currNode.next == null)){

            str += currNode.next.element + " "
            currNode = currNode.next
          }

          expect(str).to.be.equal("Jordan Kobe Lebron Durrant ")
        })

        it("remove is ok", function(){
          var singleLList = new Linkedlist.SingleLList()
            , str = ""
          
          singleLList.insert("Jordan","head")
          singleLList.insert("Lebron","Jordan")
          singleLList.insert("Kobe","Jordan")
          singleLList.insert("Durrant","Lebron")
          singleLList.remove("Jordan")
          singleLList.remove("Lebron")
          singleLList.remove("Durrant")

          currNode = singleLList.head

          while (!(currNode.next == null)){

            str += currNode.next.element + " "
            currNode = currNode.next
          }

          expect(str).to.be.equal("Kobe ")
        })
      })
    })
  }
})