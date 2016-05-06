define(["../lib/main", "./list", "./hash", "./set", "./binarytree", "./nomo", "./linkedlist"], 
  function(jsalgo, list, hash, set, binarytree, nomo, linkedlist){
    list(jsalgo.list)
    hash(jsalgo.hash)  
    set(jsalgo.set)
    binarytree(jsalgo.binarytree)
    nomo(jsalgo.nomo)
    linkedlist(jsalgo.linkedlist)
  }
)