//import chai, chai-http, and server.js for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
//get local files
var server = require('../../server.js');
var Menu = require('../../server/models/menu.js');
var ph = require('../../server/promisehelpers.js');
//
var mongoose = require('mongoose');
//extends objects with should for test chaining
var should = chai.should();
//used to make requests and check state of object
var app = server.app;
//use http plugin
chai.use(chaiHttp);
global.DATABASE_URL = 'mongodb://localhost/restaurant-pos-test';
/*
 * All tests that should be run
 */
describe('Test for menu model.', function() {
    //setup before doing tests
    before(function(done) {
        server.runServer(function() {
          //go through mongoose and create some mock items for testing
          Menu.create({name: 'cheeseburger', price: 7.99, categories: ['lunch', 'burgers', 'dinner']});
          Menu.create({name: 'spinach omlete', price: 4.99, categories: ['breakfast', 'omlete']});
          Menu.create({name: 'steak', price: 12.99, categories: ['dinner', 'entree']});
          Menu.create({name: 'reuben', price: 6.99, categories: ['lunch', 'sandwhich']}, done());
        });
    });
    //teardown after tests
    after(function(done) {
      //delete contents of menu in mongodb
      Menu.remove({}, function() {
        done();
      });
    });
    //test menu item was created
    it('should create a menu item in mongo', function(done) {
        //create menu item in mongo and log results or reject reason
        ph.promiseLogging(Menu.createItem('whataburger', 10.99, ['lunch', 'burgers', 'dinner']))
            //if succesful then return 201 with the menu item data
            .then(function(item) {
                //check returned json against expected value
                item.name.should.be.a('string');
                item.name.should.equal('whataburger');
                item.price.should.be.a('number');
                item.price.should.equal(10.99);
                item.categories.should.be.an('array')
                .to.include.members(['lunch', 'burgers', 'dinner']);
                done();
            });
    });
    it('', function(done) {

    });

});
