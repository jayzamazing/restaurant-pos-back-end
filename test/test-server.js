/*jshint esversion: 6 */
(function() {
    //import chai, chai-http for testing
    var chai = require('chai');
    var chaiHttp = require('chai-http');
    //get local files
    var server = require('../server.js');
    var Store = require('../server/models/store.js');
    var ph = require('../server/promisehelpers.js');
    var Menu = require('../server/models/menu.js');
    //extends objects with should for test chaining
    var should = chai.should();
    //used to make requests and check state of object
    var app = server.app;
    var storage = server.storage;
    //use http plugin
    chai.use(chaiHttp);
    global.DATABASE_URL = 'mongodb://localhost/restaurant-pos-test';
    /*
     * All tests that should be run
     */
    describe('Restaurant POS', function() {
        before(function(done) {
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
                });
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
                //delete contents of store in mongodb
                Store.remove({}, function() {
                    done();
                });
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
                    //TODO add more test cases
                    storage.menu_items.should.be.a('array');
                    storage.menu_items[0].should.have.property('name');
                    storage.menu_items[0].name.should.equal('hamburger');
                    storage.menu_items[0].should.have.property('price');
                    storage.menu_items[0].price.should.equal(7.99);
                    storage.menu_items[0].categories.should.be.an('array')
                        .to.include.members(['lunch', 'burgers', 'dinner']);
                    storage.menu_items[1].should.have.property('name');
                    storage.menu_items[1].name.should.equal('spinach omlete');
                    storage.menu_items[1].should.have.property('price');
                    storage.menu_items[1].price.should.equal(4.99);
                    storage.menu_items[1].categories.should.be.an('array')
                        .to.include.members(['breakfast', 'omlete']);
                    storage.menu_items[2].should.have.property('name');
                    storage.menu_items[2].name.should.equal('steak');
                    storage.menu_items[2].should.have.property('price');
                    storage.menu_items[2].price.should.equal(12.99);
                    storage.menu_items[2].categories.should.be.an('array')
                        .to.include.members(['dinner', 'entree']);
                    storage.menu_items[3].should.have.property('name');
                    storage.menu_items[3].name.should.equal('reuben');
                    storage.menu_items[3].should.have.property('price');
                    storage.menu_items[3].price.should.equal(6.99);
                    storage.menu_items[3].categories.should.be.an('array')
                        .to.include.members(['lunch', 'sandwhich']);
                    //check mongo directly to ensure data does not exist
                    Menu.find(function(err, result) {
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
                    //check returned json against expected value
                    storage.store_name.should.be.a('string');
                    storage.store_name.should.equal('FOod r Us1');
                    storage.address.should.be.a('string');
                    storage.address.should.equal('313 somewhere');
                    storage.city.should.be.a('string');
                    storage.city.should.equal('nowehere');
                    storage.state.should.be.a('string');
                    storage.state.should.equal('fl');
                    storage.zip_code.should.be.a('string');
                    storage.zip_code.should.equal('33412');
                    storage.state_tax.should.be.a('number');
                    storage.state_tax.should.equal(6.5);
                    storage.recommended_tip.should.be.a('number');
                    storage.recommended_tip.should.equal(20);
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
})();
