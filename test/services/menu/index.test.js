/*jshint esversion: 6 */
'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Menu = app.service('menus');
var User = app.service('users');
const service = require('feathers-mongoose');
var io = require('socket.io-client');
var feathers = require('feathers/client');
var hooks = require('feathers-hooks');
var socketio = require('feathers-socketio/client');
var authentication = require('feathers-authentication/client');
const middleware = require('../../../src/middleware');
const services = require('../../../src/services');
const bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const auth = require('feathers-authentication').hooks;
//config for app to do authentication
const socket = io('http://localhost:3030/');
app
  // .configure(socketio(socket))
  // .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // .configure(services)
  // .configure(middleware)
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();
// User.before({
//   create: auth.hashPassword()
// })
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
      Menu.create({
        name: 'fries',
        price: 1.99,
        categories: ['lunch', 'side']
      });
      //create mock user
      User.create({

 "username": "resposadmin",
 "password": "igzSwi7*Creif4V$"

      }, done());

    });
  });
  //teardown after tests
  after((done) => {
    //delete contents of menu in mongodb
    Menu.remove({}, () => {
      User.remove({}, () => {
        //stop the server
        this.server.close(function() {});
        done();
      });
    });

  });
  it('registered the menus service', () => {
    assert.ok(app.service('menus'));
  });
  //test for /menu get request
  it('should get menu items', (done) => {
    console.log(User);
      //setup a request
      chai.request(app)
          .post('/auth/local')
          .send({
   "username": "resposadmin",
   "password": "igzSwi7*Creif4V$"
})
          .end((err, res) => {
            console.log(res.body.token);


            done();
          })


          // //request to /menu
          // .get('/menus')
          // .auth('test@test.com', 'supertest')
          // //when finished do the following
          // .end((err, res) => {
          //     if (err) {
          //       console.error(err);
          //     }
          //     //ensure menu items have specific properties
          //     res.body.should.be.a('array');
          //     var temp2 = storage.menu_items.map((field) => {
          //         return field.name;
          //     }).indexOf('hamburger');
          //     res.body[temp2].should.have.property('name');
          //     res.body[temp2].name.should.equal('hamburger');
          //     res.body[temp2].should.have.property('price');
          //     res.body[temp2].price.should.equal(7.99);
          //     res.body[temp2].categories.should.be.an('array')
          //         .to.include.members(['lunch', 'burgers', 'dinner']);
          //     temp2 = storage.menu_items.map((field) => {
          //         return field.name;
          //     }).indexOf('spinach omlete');
          //     res.body[temp2].should.have.property('name');
          //     res.body[temp2].name.should.equal('spinach omlete');
          //     res.body[temp2].should.have.property('price');
          //     res.body[temp2].price.should.equal(4.99);
          //     res.body[temp2].categories.should.be.an('array')
          //         .to.include.members(['breakfast', 'omlete']);
          //     done();
          // });
  });
});
