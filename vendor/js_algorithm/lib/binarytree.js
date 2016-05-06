define([], function(){

  function Node(data, left, right){
    this.data = data
    this.left = left
    this.right = right
    this.show = show
  }    

  function show(){
    return this.data
  }

  function BST(){
    this.root = null
    this.insert = insert
    this.getMin = getMin
    this.getMax = getMax
    this.find = find
    this.getSmallest = getSmallest
    this.remove = remove
  } 

  function insert(data){
    var n = new Node(data, null, null)

    if (this.root == null){
      this.root = n
      return 
    }

    var current = this.root
      , parent

    while (true){
      parent = current

      if (data < current.data) {
        current = current.left
        if (current == null) {
          parent.left = n
          break
        }
      }
      else {
        current = current.right;
        if (current == null) {
         parent.right = n
         break
        }
      }
    }
  }

  function getMin(){
    var current = this.root

    while (!(current.left == null)) {
      current = current.left
    }

    return current.data
  }

  function getMax(){
    var current = this.root

    while (!(current.right == null)) {
      current = current.right
    }

    return current.data
  }

  function find(data){
    var current = this.root

    while (current !== null){

      if (current.data == data){
        return data
      }
      else if (current.data > data){
        current = current.left
      }
      else {
        current = current.right
      }
    }

    return null
  }

  function getSmallest(node){
    if (node.left == null) {
      return node
    }
    else {
      return getSmallest(node.left)
    }
  }

  function remove(data){
    this.root = removeNode(this.root, data)
  }

  function removeNode(node, data){
    if (node == null){
      return null
    }

    if (data == node.data){
      if (node.left == null && node.right == null) {
         return null
      }

      if (node.left == null) {
         return node.right
      }

      if (node.right == null) {
         return node.left
      }

      var tempNode = getSmallest(node.right)
      node.data = tempNode.data
      node.right = removeNode(node.right, tempNode.data)
      return node
    }
    else if (data < node.data) {
      node.left = removeNode(node.left, data)
      return node
    }
    else {
      node.right = removeNode(node.right, data)
      return node
    }
  }

  return BST
})  