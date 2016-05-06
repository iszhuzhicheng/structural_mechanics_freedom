requirejs.config({
  paths:{
    "chai"   : "../vendor/chai/chai",
    "mocha"  : "../vendor/mocha/mocha"
  },

  shim: {
    mocha: { exports: 'mocha' }
  }
})

define(function(require){
  var chai = require("chai")
    , mocha = require("mocha")
    
  expect = chai.expect

  mocha.setup('bdd')

  require(["./tests.js"],function(){
    mocha.run()
  })
})