//import chai, chai-http, and server.js for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
//get local files
var server = require('../../server.js');
var Store = require('../../server/models/store.js');
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
      //setup before doing tests
      server.runServer(function() {
        //go through mongoose and create some mock items for testing
        Store.create({store_name: 'FOod r Us1', address: '313 somewhere', city: 'nowehere',
        state: 'fl', zip_code: '33412', state_tax: 6.5, recommended_tip: 20});
        Store.create({store_name: 'FOod r Us2', address: '219 everywhere ln', city: 'compton',
        state: 'ca', zip_code: '93213', state_tax: 12, recommended_tip: 18});
        Store.create({store_name: 'FOod r Us3', address: '2312 hotdog ln', city: 'whoknows',
        state: 'ga', zip_code: '24232', state_tax: 5, recommended_tip: 15});
        Store.create({store_name: 'FOod r Us4', address: '234 rodeo pk', city: 'bfe',
        state: 'tx', zip_code: '45324', state_tax: 4, recommended_tip: 12}, done());
      });
  });
  //teardown after tests
  after(function(done) {
    //delete contents of menu in mongodb
    Store.remove({}, function() {
      done();
    });
  });
  //test store was created
  it('should create a menu item in mongo', function(done) {
      //create store in mongo and log results or reject reason
      ph.promiseLogging(Store.create({store_name: 'FOod r Us5', address: '19 fun ln', city: 'amityville',
      state: 'NH', zip_code: '12423-3343', state_tax: 9, recommended_tip: 17}, done()))
          //if succesful then return 201 with the menu item data
          .then(function(item) {
              //check returned json against expected value
              item.store_name.should.be.a('string');
              item.store_name.should.equal('FOod r Us5');
              item.address.should.be.a('string');
              item.address.should.equal('19 fun ln');
              item.city.should.be.a('string');
              item.city.should.equal('amityville');
              item.state.should.be.a('string');
              item.state.should.equal('NH');
              item.zip_code.should.be.a('string');
              item.zip_code.should.equal('12423-3343');
              item.state_tax.should.be.a('number');
              item.state_tax.should.equal(9);
              item.recommended_tip.should.be.a('number');
              item.recommended_tip.should.equal(17);
              done();
          });
  });
});
