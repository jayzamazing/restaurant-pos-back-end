/*jshint esversion: 6 */
(function() {
    //import chai, chai-http, and server.js for testing
    var chai = require('chai');
    var chaiHttp = require('chai-http');
    //get local files
    var server = require('../../server.js');
    var User = require('../../server/models/user-model.js');
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
    describe('Test for user model.', function() {
      //test user was created
      it('should create a user in mongo', function(done) {
        //initialize and declare user model
        var user = new User({username: 'blah', password: 'kablah'});
        console.log('created user');
        //save the credentials to mongodb
        // user.save(function(err) {
        //   if(err) {
        //     console.log('there was an error');
        //     console.log(err);
        //   }
        //   });
        //   console.log('worked');
        ph.promiseLogging(user.saveCredentials()).then(function() {done();});
          //check mongodb directly
          // User.findOne({username: 'blah'}, function(err, result) {
          //   result.username.should.be.a('string');
          //   result.username.should.equal('blah');
          //   result.password.should.be.a('string');
          //   result.password.should.not.equal('kablah');
          // });
          // ph.promiseLogging(user.validatePassword('kablah'))
          // .then(function(valid) {
          //   console.log('looking at valid');
          //   console.log(valid);
          //   valid.should.equal('true');
          // });

        console.log('after save');
      });
    });
  })();
