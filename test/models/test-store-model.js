/*jshint esversion: 6 */
(function() {
    //import chai, chai-http, and server.js for testing
    var chai = require('chai');
    var chaiHttp = require('chai-http');
    //get local files
    var server = require('../../controllers/server.js');
    var Store = require('../../models/store-model.js');
    var ph = require('../../lib/promisehelpers.js');
    //extends objects with should for test chaining
    var should = chai.should();
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
                Store.create({
                    store_name: 'FOod r Us1',
                    address: '313 somewhere',
                    city: 'nowehere',
                    state: 'fl',
                    zip_code: '33412',
                    state_tax: 6.5,
                    recommended_tip: 20
                });
                Store.create({
                    store_name: 'FOod r Us2',
                    address: '219 everywhere ln',
                    city: 'compton',
                    state: 'ca',
                    zip_code: '93213',
                    state_tax: 12,
                    recommended_tip: 18
                });
                Store.create({
                    store_name: 'FOod r Us3',
                    address: '2312 hotdog ln',
                    city: 'whoknows',
                    state: 'ga',
                    zip_code: '24232',
                    state_tax: 5,
                    recommended_tip: 15
                });
                Store.create({
                    store_name: 'FOod r Us4',
                    address: '234 rodeo pk',
                    city: 'bfe',
                    state: 'tx',
                    zip_code: '45324',
                    state_tax: 4,
                    recommended_tip: 12
                }, done());
            });
        });
        //teardown after tests
        after(function(done) {
            //delete contents of store in mongodb
            Store.remove({}, function() {
                done();
            });
        });
        //test store was created
        it('should create a store in mongo', function(done) {
            //create store in mongo and log results or reject reason
            ph.promiseLogging(Store.createStore('FOod r Us5', '19 fun ln', 'amityville',
                    'NH', '12423', 9, 17))
                //if succesful then return 201 with the store data
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
                    item.zip_code.should.equal('12423');
                    item.state_tax.should.be.a('number');
                    item.state_tax.should.equal(9);
                    item.recommended_tip.should.be.a('number');
                    item.recommended_tip.should.equal(17);
                    //check mongo directly to see data was stored
                    Store.findOne({
                        store_name: 'FOod r Us5'
                    }, function(err, result) {
                        //check returned json against expected value
                        result.store_name.should.be.a('string');
                        result.store_name.should.equal('FOod r Us5');
                        result.address.should.be.a('string');
                        result.address.should.equal('19 fun ln');
                        result.city.should.be.a('string');
                        result.city.should.equal('amityville');
                        result.state.should.be.a('string');
                        result.state.should.equal('NH');
                        result.zip_code.should.be.a('string');
                        result.zip_code.should.equal('12423');
                        result.state_tax.should.be.a('number');
                        result.state_tax.should.equal(9);
                        result.recommended_tip.should.be.a('number');
                        result.recommended_tip.should.equal(17);
                    });
                    done();
                });
        });
        //test store was updated
        it('should update a store in mongo', function(done) {
            //update store in mongo and log results or reject reason
            ph.promiseLogging(Store.updateStore('FOod r Us5', 'Foodizawezome', '35 fun ln', 'nowhere',
                    'ny', '32343-8776', 15, 9))
                //if succesful then return 201 with the store data
                .then(function(item) {
                    //check returned json against expected value
                    item.store_name.should.be.a('string');
                    item.store_name.should.equal('Foodizawezome');
                    item.address.should.be.a('string');
                    item.address.should.equal('35 fun ln');
                    item.city.should.be.a('string');
                    item.city.should.equal('nowhere');
                    item.state.should.be.a('string');
                    item.state.should.equal('ny');
                    item.zip_code.should.be.a('string');
                    item.zip_code.should.equal('32343-8776');
                    item.state_tax.should.be.a('number');
                    item.state_tax.should.equal(15);
                    item.recommended_tip.should.be.a('number');
                    item.recommended_tip.should.equal(9);
                    //check mongo directly to see data was stored
                    Store.findOne({
                        store_name: 'Foodizawezome'
                    }, function(err, result) {
                        result.store_name.should.be.a('string');
                        result.store_name.should.equal('Foodizawezome');
                        result.address.should.be.a('string');
                        result.address.should.equal('35 fun ln');
                        result.city.should.be.a('string');
                        result.city.should.equal('nowhere');
                        result.state.should.be.a('string');
                        result.state.should.equal('ny');
                        result.zip_code.should.be.a('string');
                        result.zip_code.should.equal('32343-8776');
                        result.state_tax.should.be.a('number');
                        result.state_tax.should.equal(15);
                        result.recommended_tip.should.be.a('number');
                        result.recommended_tip.should.equal(9);
                        Store.findOne({
                            name: 'FOod r Us5'
                        }, function(err, result) {
                            //if null is returned, then value is not in mongo
                            should.not.exist(err);
                            should.not.exist(result);
                        });
                    });
                    done();
                });
        });
        //test getting a specific store
        it('should get a store from mongo', function(done) {
            //get store from mongo and log results or reject reason
            ph.promiseLogging(Store.getStore('Foodizawezome'))
                //if succesful then return 201 with the store data
                .then(function(item) {
                    //check returned json against expected value
                    item.store_name.should.be.a('string');
                    item.store_name.should.equal('Foodizawezome');
                    item.address.should.be.a('string');
                    item.address.should.equal('35 fun ln');
                    item.city.should.be.a('string');
                    item.city.should.equal('nowhere');
                    item.state.should.be.a('string');
                    item.state.should.equal('ny');
                    item.zip_code.should.be.a('string');
                    item.zip_code.should.equal('32343-8776');
                    item.state_tax.should.be.a('number');
                    item.state_tax.should.equal(15);
                    item.recommended_tip.should.be.a('number');
                    item.recommended_tip.should.equal(9);
                    //check mongo directly to see data was stored
                    Store.findOne({
                        store_name: 'Foodizawezome'
                    }, function(err, result) {
                        result.store_name.should.be.a('string');
                        result.store_name.should.equal('Foodizawezome');
                        result.address.should.be.a('string');
                        result.address.should.equal('35 fun ln');
                        result.city.should.be.a('string');
                        result.city.should.equal('nowhere');
                        result.state.should.be.a('string');
                        result.state.should.equal('ny');
                        result.zip_code.should.be.a('string');
                        result.zip_code.should.equal('32343-8776');
                        result.state_tax.should.be.a('number');
                        result.state_tax.should.equal(15);
                        result.recommended_tip.should.be.a('number');
                        result.recommended_tip.should.equal(9);
                    });
                    done();
                });
        });
        //test deleting a specific store
        it('should delete a store from mongo', function(done) {
            //update store in mongo and log results or reject reason
            ph.promiseLogging(Store.deleteStore('Foodizawezome'))
                //if succesful then return 201 with the store data
                .then(function(item) {
                    //check returned json against expected value
                    item.should.be.a('string');
                    item.should.equal('Foodizawezome');
                    Store.findOne({
                        name: 'Foodizawezome'
                    }, function(err, result) {
                        //if null is returned, then value is not in mongo
                        should.not.exist(err);
                        should.not.exist(result);
                        done();
                    });
                });
        });
    });
})();
