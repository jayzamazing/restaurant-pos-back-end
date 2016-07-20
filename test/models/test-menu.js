/*jshint esversion: 6 */
(function() {
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
                Menu.create({
                    name: 'hamburger',
                    price: 7.99,
                    categories: ['lunch', 'burgers', 'dinner']
                });
                Menu.create({
                    name: 'spinach omlete',
                    price: 4.99,
                    categories: ['breakfast', 'omlete']
                });
                Menu.create({
                    name: 'steak',
                    price: 12.99,
                    categories: ['dinner', 'entree']
                });
                Menu.create({
                    name: 'reuben',
                    price: 6.99,
                    categories: ['lunch', 'sandwhich']
                }, done());
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
                    //check mongo directly to see data was stored
                    Menu.findOne({
                        name: 'whataburger'
                    }, function(err, result) {
                        result.name.should.be.a('string');
                        result.name.should.equal('whataburger');
                        result.price.should.be.a('number');
                        result.price.should.equal(10.99);
                        result.categories.should.be.an('array')
                            .to.include.members(['lunch', 'burgers', 'dinner']);
                    });
                    done();
                });
        });
        //test menu item was updated
        it('should update menu item in mongo', function(done) {
            ph.promiseLogging(Menu.updateItem('whataburger', 'cheeseburger', 7.99, ['lunch', 'burgers']))
                //if succesful then return 201 with the menu item data
                .then(function(item) {
                    //check returned json against expected value
                    item.name.should.be.a('string');
                    item.name.should.equal('cheeseburger');
                    item.price.should.be.a('number');
                    item.price.should.equal(7.99);
                    item.categories.should.be.an('array')
                        .to.include.members(['lunch', 'burgers']);
                    //check mongo directly to see data was stored
                    Menu.findOne({
                        name: 'cheeseburger'
                    }, function(err, result) {
                        result.name.should.be.a('string');
                        result.name.should.equal('cheeseburger');
                        result.price.should.be.a('number');
                        result.price.should.equal(7.99);
                        result.categories.should.be.an('array')
                            .to.include.members(['lunch', 'burgers']);
                    });
                    Menu.findOne({
                        name: 'whataburger'
                    }, function(err, result) {
                        //if null is returned, then value is not in mongo
                        should.not.exist(err);
                        should.not.exist(result);
                    });
                    done();
                });
        });
        //test menu item was deleted
        it('should delete menu item in mongo', function(done) {
            ph.promiseLogging(Menu.deleteItem('cheeseburger'))
                //if succesful then return 201 with the menu item data
                .then(function(item) {
                    //check returned json against expected value
                    item.name.should.be.a('string');
                    item.name.should.equal('cheeseburger');
                    item.price.should.be.a('number');
                    item.price.should.equal(7.99);
                    item.categories.should.be.an('array')
                        .to.include.members(['lunch', 'burgers']);
                    //check mongo directly to ensure data does not exist
                    Menu.findOne({
                        name: 'cheeseburger'
                    }, function(err, result) {
                        //if null is returned, then value is not in mongo
                        should.not.exist(err);
                        should.not.exist(result);
                        done();
                    });
                });
        });
        //test that only the 4 original items are returned
        it('should get all menu items from mongo', function(done) {
            ph.promiseLogging(Menu.getMenu())
                //if succesful then return 201 with the menu item data
                .then(function(item) {
                    //check returned json against expected value
                    item.length.should.eql(4);
                    item[0].should.have.property('name');
                    item[0].name.should.equal('hamburger');
                    item[0].should.have.property('price');
                    item[0].price.should.equal(7.99);
                    item[0].categories.should.be.an('array')
                        .to.include.members(['lunch', 'burgers', 'dinner']);
                    item[1].should.have.property('name');
                    item[1].name.should.equal('spinach omlete');
                    item[1].should.have.property('price');
                    item[1].price.should.equal(4.99);
                    item[1].categories.should.be.an('array')
                        .to.include.members(['breakfast', 'omlete']);
                    item[2].should.have.property('name');
                    item[2].name.should.equal('steak');
                    item[2].should.have.property('price');
                    item[2].price.should.equal(12.99);
                    item[2].categories.should.be.an('array')
                        .to.include.members(['dinner', 'entree']);
                    item[3].should.have.property('name');
                    item[3].name.should.equal('reuben');
                    item[3].should.have.property('price');
                    item[3].price.should.equal(6.99);
                    item[3].categories.should.be.an('array')
                        .to.include.members(['lunch', 'sandwhich']);
                    //check mongo directly to ensure data does not exist
                    Menu.find({}, null, {sort: {'_id': 1}}, function(err, result) {
                        result[0].should.have.property('name');
                        result[0].name.should.equal('hamburger');
                        result[0].should.have.property('price');
                        result[0].price.should.equal(7.99);
                        result[0].categories.should.be.an('array')
                            .to.include.members(['lunch', 'burgers', 'dinner']);
                        result[1].should.have.property('name');
                        result[1].name.should.equal('spinach omlete');
                        result[1].should.have.property('price');
                        result[1].price.should.equal(4.99);
                        result[1].categories.should.be.an('array')
                            .to.include.members(['breakfast', 'omlete']);
                        result[2].should.have.property('name');
                        result[2].name.should.equal('steak');
                        result[2].should.have.property('price');
                        result[2].price.should.equal(12.99);
                        result[2].categories.should.be.an('array')
                            .to.include.members(['dinner', 'entree']);
                        result[3].should.have.property('name');
                        result[3].name.should.equal('reuben');
                        result[3].should.have.property('price');
                        result[3].price.should.equal(6.99);
                        result[3].categories.should.be.an('array')
                            .to.include.members(['lunch', 'sandwhich']);
                    });
                    done();
                });
        });
    });
})();
