define([],function(){
  function Hash(type){
    this.table = new Array(613)
    this.betterhash = betterhash
    this.put = put 
    this.get = get
    this.clear = clear(type)

    if (type == "openchain") {
    
      for (var i = 0; i < this.table.length; ++i) {
        this.table[i] = new Array()
      }
    
      this.put = openchain_put
      this.get = openchain_get
    
    } else if (type == "linear"){

      this.values = new Array(613)

      this.put = linear_put
      this.get = linear_get
    }

  }

  // basic
  function betterhash(string){
    var H = 53
      , total = 0

    for (var i = 0; i < string.length; ++i){
      total +=  H * total + string.charCodeAt(i)
    }

    total = total % this.table.length

    if (total < 0) {
      total += this.table.length-1
    }

    return parseInt(total)
  } 

  function put(data){
    var pos = this.betterhash(data)
    this.table[pos] = data
  }

  function get(data){
    return this.table[this.betterhash(data)]
  }

  function clear(type){
    return function(){
      for (var i = 0; i < this.table.length; ++i) {
        if (typeof type == 'undefined'){
          this.table[i] = undefined
        } else if (type == "openchain"){
          this.table[i] = new Array()
        } else if (type == "linear"){
          this.table[i] = undefined
          this.values[i] =undefined
        }
      }
    }
  }

  // openchain
  function openchain_put(key,data){
    var pos = this.betterhash(key)
      , index = 0

    while (typeof this.table[pos][index] !== "undefined") {

      if (data) {
        index += 2
      } else {
        index++
      }
    }
    
    this.table[pos][index] = key

    // according to my understanding,adding the data in order to save object.
    if (data) {
      this.table[pos][index+1] = data
    }
  }

  function openchain_get(key,isData){
    var pos = this.betterhash(key)
      , index = 0

    while (this.table[pos][index] !== key&& typeof this.table[pos][index] !== "undefined") {
      if (isData) {
        index += 2
      } else {
        index++        
      }
    }
    if (isData) {
      index += 1 
    }

    return this.table[pos][index]
  }

  // linear 
  function linear_put(key, data){
    var pos = this.betterhash(key)

    while (typeof this.table[pos] !== "undefined") {
      pos++
    }

    this.table[pos] = key

    if (data){
      this.values[pos] = data
    }
  }

  function linear_get(key, isData){
    var pos = this.betterhash(key)

    if (!isData) {
      return this.table[pos]
    } else {
      return this.values[pos]
    }
  }

  return Hash
})