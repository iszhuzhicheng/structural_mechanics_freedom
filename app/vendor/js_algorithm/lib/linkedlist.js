define([],function(){

  // 单向链表
  function Node(element){
    this.element = element
    this.next = null
  }

  function LList(){
    this.head = new Node("head")
    this.find = find
    this.insert = insert
    this.remove = remove
    this.findPrevious = findPrevious
  }

  function find(element){
    var currNode = this.head

    while (currNode.element !== element){
      currNode = currNode.next
      if (currNode == null){
        return null
      }
    }
    
    return currNode
  }

  function insert(newElement, currNode){
    var newElement = new Node(newElement)
      , currNode = this.find(currNode) 
      
    newElement.next = currNode.next
    currNode.next = newElement
  }

  function remove(removeNode){
    var prevNode = this.findPrevious(removeNode) 

    if (prevNode.next !== null){
      prevNode.next = prevNode.next.next
    }
  }

  function findPrevious(item){
    var currNode = this.head

    while (currNode.next !== null && currNode.next.element !== item){
      currNode = currNode.next 
    }

    return currNode
  }

  return {
    SingleLList: LList
  } 
})