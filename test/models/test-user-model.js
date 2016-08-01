/*jshint esversion: 6 */
(function() {
    global.DATABASE_URL = 'mongodb://localhost/restaurant-pos-test';
    //import chai, chai-http, and server.js for testing
    var chai = require('chai');
    var chaiHttp = require('chai-http');
    //get local files
    var server = require('../../controllers/server.js');
    var User = require('../../models/user-model.js');
    var ph = require('../../lib/promisehelpers.js');
    //use http plugin
    chai.use(chaiHttp);
    /*
     * All tests that should be run
     */
    describe('Test for user model.', function() {
        /*
         * All tests that should be run
         */
        before(function(done) {
            server.runServer(function() {
              done();
            });
        });
        //teardown after tests
        after(function(done) {
            //delete contents of menu in mongodb
            User.remove({}, function() {
                done();
            });
        });
        //test user was created
        it('should create a user in mongo', function(done) {
            //initialize and declare user model
            var user = new User({
                username: "supahbored",
                password: "kablah"
            });
            //save credentials to mongodb
            ph.promiseLogging(user.saveCredentials())
                .then(function(item) {
                    //check the response against what is expected
                    item.should.be.a('string');
                    item.should.equal('Saved user credentials');
                    //check against what is stored in mongodb
                    User.findOne({
                        username: "supahbored"
                    }, function(err, result) {
                      //check the response against what is expected
                      result.username.should.be.a('string');
                      result.username.should.equal('supahbored');
                      //validate expected password against what is stored in mongodb
                      //using bcrypt to compare the values
                      ph.promiseLogging(user.validatePassword('kablah'))
                      .then(function(result) {
                        result.should.be.true;
                        done();
                      });
                    });
                });
        });
    });
})();
