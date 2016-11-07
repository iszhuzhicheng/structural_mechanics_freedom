define(["./list", "./hash", "./set", "./binarytree", "./nomo", "./linkedlist"],
  function(list, hash, set, binarytree, nomo, linkedlist){  
    return {  
      list       : list,
      hash       : hash,
      set        : set,
      binarytree : binarytree,
      nomo       : nomo,
      linkedlist : linkedlist
    }
  }
)