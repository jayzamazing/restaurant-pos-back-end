'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Menu = app.service('menus');
var User = app.service('users');
var authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();
/*
 * All tests that should be run
 */
describe('menu service', () => {
  //setup
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
      //create some mock menu items
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
      });
      Menu.create({
        name: 'soft drink',
        price: 1.99,
        categories: ['drinks', 'soda']
      });
      //create mock user
      User.create({
         'username': 'resposadmin',
         'password': 'igzSwi7*Creif4V$',
         'roles': ['admin']
      }, () => {
        //setup a request to get authentication token
        chai.request(app)
            //request to /auth/local
            .post('/auth/local')
            //set header
            .set('Accept', 'application/json')
            //send credentials
            .send({
               'username': 'resposadmin',
               'password': 'igzSwi7*Creif4V$'
            })
            //when finished
            .end((err, res) => {
              //set token for auth in other requests
              token = res.body.token;
              done();
            });
      });

    });
  });
  //teardown after tests
  after((done) => {
    //delete contents of menu in mongodb
    Menu.remove(null, () => {
      User.remove(null, () => {
        //stop the server
        this.server.close(function() {});
        done();
      });
    });

  });
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
  it('should post the menuitem data', function(done) {
      //setup a request
      chai.request(app)
          //request to /store
          .post('/menus')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
              name: 'shrimp fettuccine',
              price: 12.99,
              categories: 'dinner, pasta'
          })
          //when finished do the following
          .end((err, res) => {
              res.body.should.have.property('name');
              res.body.name.should.equal('shrimp fettuccine');
              res.body.should.have.property('price');
              res.body.price.should.equal(12.99);
              res.body.categories.should.be.an('array')
                  .to.include.members(['dinner, pasta']);
              done();
          });
  });
  //test for put for /menuitem
  it('should update the menuitem data', function(done) {
      chai.request(app)
          //request to /store
          .get('/menus')
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //when finished do the following
          .end((err, res) => {
            //setup a request
            chai.request(app)
                //request to /menuitem
                .put('/menus/' + res.body.data[2]._id)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer '.concat(token))
                //attach data to request
                .send({
                      name: 'steak sub',
                      price: 10.99,
                      categories: 'dinner, sandwhich'
                    }
                )
                //when finished do the following
                .end(function(err, res) {
                    res.body.should.have.property('name');
                    res.body.name.should.equal('steak sub');
                    res.body.should.have.property('price');
                    res.body.price.should.equal(10.99);
                    res.body.categories.should.be.an('array')
                        .to.include.members(['dinner, sandwhich']);
                    done();
                });
          });

  });
  //test to delete /menuitem
  it('should delete the menu item data', function(done) {
    chai.request(app)
        //request to /store
        .get('/menus')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer '.concat(token))
        //when finished do the following
        .end((err, res) => {
          //setup a request
          chai.request(app)
              //request to /menuitem
              .delete('/menus/' + res.body.data[4]._id)
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer '.concat(token))
              //when finished do the following
              .end(function(err, res) {
                  //check returned json against expected value
                  res.body.name.should.be.a('string');
                  res.body.name.should.equal('soft drink');
                  res.body.price.should.be.a('number');
                  res.body.price.should.equal(1.99);
                  res.body.categories.should.be.an('array')
                      .to.include.members(['drinks', 'soda']);
                  done();
              });
        });

  });
  //test for /menu get request
  it('should get menu items', (done) => {
            //setup a request
            chai.request(app)
            //request to /menu
            .get('/menus')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer '.concat(token))
            //when finished do the following
            .end((err, res) => {
                if (err) {
                  console.error(err);
                }
                //ensure menu items have specific properties
                res.body.data.should.be.a('array');
                res.body.data[0].should.have.property('name');
                res.body.data[0].name.should.equal('hamburger');
                res.body.data[0].should.have.property('price');
                res.body.data[0].price.should.equal(7.99);
                res.body.data[0].categories.should.be.an('array')
                    .to.include.members(['lunch', 'burgers', 'dinner']);
                res.body.data[1].should.have.property('name');
                res.body.data[1].name.should.equal('spinach omlete');
                res.body.data[1].should.have.property('price');
                res.body.data[1].price.should.equal(4.99);
                res.body.data[1].categories.should.be.an('array')
                    .to.include.members(['breakfast', 'omlete']);
                done();
            });
  });
});
