define([],function(){

  return function(Nomo){
    describe("Nomo", function(){

      it("default vertices nomo is ok", function(){
        var nomo = new Nomo(5)

        nomo.addEdge(0,1)
        nomo.addEdge(0,2)
        nomo.addEdge(1,3)
        nomo.addEdge(2,4)

        var str = ""

        for (var i = 0; i < nomo.vertices; i++){
          str += (i + " -> ")

          for (var j = 0; j < nomo.vertices; j++){

            if (nomo.adj[i][j] != undefined){
              str += (nomo.adj[i][j] + ' ')
            }
   
          }

          str += " "
        }

        expect(str).to.be.equal("0 -> 1 2  1 -> 0 3  2 -> 0 4  3 -> 1  4 -> 2  ")       
      })
      
      it("random vertices nomo is ok", function(){  
        var nomo = new Nomo()

        nomo.addEdge("Beijing","Nanjing")
        nomo.addEdge("Qingdao","Nanjing")
        nomo.addEdge("Jinan","Beijing")

        var str = ""

        for (var i = 0; i < Object.keys(nomo.adj).length ; i++){

          str += (Object.keys(nomo.adj)[i] + " -> ")

          for  (var j = 0; j < Object.keys(nomo.adj).length ; j++){

            if (nomo.adj[Object.keys(nomo.adj)[i]][j] != undefined){
              str += (nomo.adj[Object.keys(nomo.adj)[i]][j] + " ")
            }
          }

          str += " "
        }

        expect(str).to.be.equal("Beijing -> Nanjing Jinan  Nanjing -> Beijing Qingdao  Qingdao -> Nanjing  Jinan -> Beijing  ")  
      })

      it("depth first search is ok", function(){
        var nomo = new Nomo(5)
          , str = ""
          , addStr = function(v){
              str += "Visited : " + v + "  "
            }

        nomo.addEdge(0,1)
        nomo.addEdge(0,2)
        nomo.addEdge(1,3)
        nomo.addEdge(2,4)

        nomo.dfs(0,addStr)

        expect(str).to.be.equal("Visited : 0  Visited : 1  Visited : 3  Visited : 2  Visited : 4  ")  

      })

      it("breadth first search is ok", function(){
        var nomo = new Nomo(5)
          , str = ""
          , addStr = function(v){
              str += "Visited : " + v + "  "
            }

        nomo.addEdge(0,1)
        nomo.addEdge(0,2)
        nomo.addEdge(1,3)
        nomo.addEdge(2,4)

        nomo.bfs(0,addStr)

        expect(str).to.be.equal("Visited : 0  Visited : 1  Visited : 2  Visited : 3  Visited : 4  ")  

      })

      it("shortest path", function(){
        var nomo = new Nomo(7)
          , str = ""

        nomo.addEdge(0,1)
        nomo.addEdge(0,2)
        nomo.addEdge(1,3)
        nomo.addEdge(5,3)
        nomo.addEdge(5,6)
        nomo.addEdge(4,6)t
        nomo.addEdge(2,4)

        nomo.bfs(0)

        var paths = nomo.pathTo(2,6)

        while (paths.length > 0) {

          if (paths.length > 1) {
            str += (paths.pop() + '-')
          }
          else {
            str += paths.pop()
          }
        }

        expect(str).to.be.equal("2-4-6")
      })
    })    
  }
})