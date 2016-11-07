define([],function(){

  function Vertex(label){
    this.label = label
  }

  function Graph(v){    
    this.edges = 0
    this.adj = []
    this.vertices = v
    this.marked = []
    this.edgeTo = []

    if (this.vertices){

      for (var i = 0; i < this.vertices; i++){
        this.adj[i] = []
        this.marked[i] = false
      }
    }

    this.addEdge = addEdge

    this.dfs = dfs
    this.bfs = bfs
    this.pathTo = pathTo
    this.hasPathTo = hasPathTo
  }

  function addEdge(v, w){
    if (!Array.isArray(this.adj[v])){
      this.adj[v] = []
    }

    if (!Array.isArray(this.adj[w])){
      this.adj[w] = []
    }

    this.adj[v].push(w)
    this.adj[w].push(v)
    
    this.edges++
  }

  function dfs(v,func){
    this.marked[v] = true

    if (this.adj[v] != undefined&& func){
      func(v)
    }
    
    for (var i = 0;i < this.adj[v].length; i++){
      var w = this.adj[v][i]
      if (!this.marked[w]) {
        this.dfs(w,func)
      }
    }
  }

  function bfs(s,func) {
    var queue = []

    this.marked[s] = true

    queue.push(s)

    while (queue.length > 0) {

      var v = queue.shift()

      if (v !== undefined&& func) {
        func(v)
      }

      for (var i = 0;i < this.adj[v].length; i++) {

        var w = this.adj[v][i]

        if (!this.marked[w]) {
          this.edgeTo[w] = v
          this.marked[w] = true
          queue.push(w)
        }
      }
    }
  }

  function pathTo(start,end){
    var source = start
      , path = []

    if (!this.hasPathTo(end)) {
      return undefined
    }

    for (var i = end; i != source; i = this.edgeTo[i]) {
      path.push(i)
    }

    path.push(source)

    return path
  }

  function hasPathTo(v){
    return this.marked[v]
  }

  return Graph
})