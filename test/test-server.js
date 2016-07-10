//import chai, chai-http, and server.js for testing
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
//extends objects with should for test chaining
var should = chai.should();
//used to make requests and check state of object
var app = server.app;
var storage = server.storage;
//use http plugin
chai.use(chaiHttp);
/*
 * All tests that should be run
 */
describe('Restaurant POS', function() {
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
                //TODO more tests for state of server
                done();
            });
    });
    //test /order request
    it('should post to /order', function(done) {
        //setup a request
        chai.request(app)
            //post to /order
            .post('/order')
            //attach data to request
            .send({
                "table_number": 2,
                "dinner_number": 1,
                "order": [
                    "burger",
                    "fries",
                    "soft drink"
                ]
            })
            //when done do the following
            .end(function(err, res) {
              //check server gives 200 response
              res.should.have.status(200);
              //TODO more tests for state of server
              done();
            });
    });
});
