//import chai, chai-http, and server.js for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
//extends objects with should for test chaining
var should = chai.should();
//used to make requests and check state of object
var app = server.app;
//TODO uncomment when implementing restaurant
//var storage = server.storage;
//use http plugin
chai.use(chaiHttp);
/*
 * All tests that should be run
 */
describe('Restaurant POS', function() {
    before(function(done){
      server.runServer(function() {
        done();
      });
    });
    //test for / request
    it('should get index.html', function(done) {
        //setup a request
        chai.request(app)
            //request to /
            .get('/')
            //when finished do the following
            .end(function(err, res) {
                //check server gives 200 response
                res.should.have.status(200);
                //check valid content is being sent back
                res.should.have.header('content-type', 'text/html; charset=UTF-8');
                //ensure menu items is an array with objects that have specific properties
                //TODO uncomment when restaurant is reimplemented
                //storage.menu_items.should.be.a('array');
                //storage.menu_items[0].should.have.property('description');
                //storage.menu_items[0].should.have.property('price');
                //deal with asynchronous call
                done();
            });
    });

    //TODO uncomment when restaurant is reimplemented
    //test /order request
    // it('should post to /order', function(done) {
    //     //setup a request
    //     chai.request(app)
    //         //post to /order
    //         .post('/order')
    //         //attach data to request
    //         .send({
    //             "table_number": 2,
    //             "dinner_number": 1,
    //             "order": [
    //                 "burger",
    //                 "fries",
    //                 "soft drink"
    //             ]
    //         })
    //         //when done do the following
    //         .end(function(err, res) {
    //             //check server gives 200 response
    //             res.should.have.status(200);
    //             //check stored values match for description and price
    //             storage.floorTables.tables.get('table2').get('Dinner #1').dishes[0].should.have.property('description');
    //             storage.floorTables.tables.get('table2').get('Dinner #1').dishes[0].should.have.property('price');
    //             storage.floorTables.tables.get('table2').get('Dinner #1').dishes[0].description.should.equal('burger');
    //             storage.floorTables.tables.get('table2').get('Dinner #1').dishes[0].price.should.equal(7.99);
    //             done();
    //         });
    //});
});
describe('run test-menu.js', function() {
  require('./models/test-menu.js');
});
