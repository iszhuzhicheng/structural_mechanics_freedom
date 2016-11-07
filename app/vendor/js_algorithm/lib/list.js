define([],function(){

  function List() {
     this.listSize = 0
     this.pos = 0
     this.dataStore = []
     this.clear = clear
     this.find = find
     this.toString = toString
     this.append = append
     this.insert = insert
     this.remove = remove
     this.front = front
     this.end = end
     this.prev = prev
     this.next = next
     this.length = length
     this.currPos = currPos
     this.moveTo = moveTo
     this.getElement = getElement
     this.length = length
  }

  function append(element){
     this.dataStore[this.listSize++] = element
  }

  function clear(){
     delete this.dataStore
     this.dataStore = []
     this.listSize = this.pos = 0
  }

  function find(element){
     return this.dataStore.indexOf(element)
  }

  function insert(element,after){
     var pos = this.find(after)

     if (pos > -1) {
        this.dataStore.splice(pos+1,0,element)
        this.listSize++
        return true
     }

     return false   
  }

  function remove(element){
     var pos = this.find(element)

     if (pos > -1) {
        this.dataStore.splice(pos,1)
        this.listSize--
        return true
     }

     return false
  }

  function front(){
     this.pos = 0 
  }

  function end(){
     this.pos = this.listSize - 1 
  }

  function prev(){
     if (this.pos > 0){
        --this.pos
     }
  }

  function next(){
     if (this.pos < this.listSize - 1){
        ++this.pos
     }
  }

  function length(){
     return this.listSize
  }

  function currPos(){
     return this.pos
  }

  function moveTo(position){
     if (position>=0&&position<this.length()){
        this.pos = position 
        return true
     }

     return false
  }

  function getElement(){
     return this.dataStore[this.pos]
  }

  return List
})