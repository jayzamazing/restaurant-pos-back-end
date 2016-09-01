'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../../../src/app');
var Category = app.service('categories');
var User = app.service('users');
var authentication = require('feathers-authentication/client');
const bodyParser = require('body-parser');
var token;
//config for app to do authentication
app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  .configure(authentication());
//use http plugin
chai.use(chaiHttp);
//use should
var should = chai.should();
/*
 * All tests that should be run
 */
describe('categories service', function() {
  before((done) => {
    //start the server
    this.server = app.listen(3030);
    //once listening do the following
    this.server.once('listening', () => {
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
  //setup
  beforeEach((done) => {
    //create some mock category items
    Category.create([
      {
        name: 'breakfast'
      },
      {
        name: 'dinner'
      },
      {
        name: 'drinks'
      },
      {
        name: 'lunch'
      }
    ],
    done
    );
  });
  //teardown after tests
  after((done) => {

    User.remove(null, () => {
      //stop the server
      this.server.close(function() {});
      done();
    });
  });
  afterEach((done) => {
    //delete contents of category in mongodb
    Category.remove(null, () => {
      done();
    });
  });

  it('registered the categories service', () => {
    assert.ok(app.service('categories'));
  });
  it('should post the category item data', function(done) {
    //setup a request
    chai.request(app)
      //request to /categories
      .post('/categories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      //attach data to request
      .send({
        name: 'burgers'
      })
      //when finished do the following
      .end((err, res) => {
        res.body.should.have.property('name');
        res.body.name.should.equal('burgers');
        done();
      });
  });
  //test for put for /categories item
  it('should update the categories item data', function(done) {
    chai.request(app)
      //request to /store
      .get('/categories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: {
            _id: 1
          }
        }
      })
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /categories
          .put('/categories/' + res.body.data[2]._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //attach data to request
          .send({
            name: 'entree',
          })
          //when finished do the following
          .end(function(err, res) {
            res.body.should.have.property('name');
            res.body.name.should.equal('entree');
            done();
          });
      });

  });
  //test to delete /categories item
  it('should delete the category item data', function(done) {
    chai.request(app)
      //request to /store
      .get('/categories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: {
            _id: 1
          }
        }
      })
      //when finished do the following
      .end((err, res) => {
        //setup a request
        chai.request(app)
          //request to /categories
          .delete('/categories/' + res.body.data[3]._id)
          .set('Accept', 'application/json')
          .set('Authorization', 'Bearer '.concat(token))
          //when finished do the following
          .end(function(err, res) {
            //check returned json against expected value
            res.body.name.should.be.a('string');
            res.body.name.should.equal('lunch');
            done();
          });
      });

  });
  //test for /categories get request
  it('should get category items', (done) => {
    //setup a request
    chai.request(app)
      //request to /categories
      .get('/categories')
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer '.concat(token))
      .send({
        query: {
          $sort: {
            _id: 1
          }
        }
      })
      //when finished do the following
      .end((err, res) => {
        if (err) {
          console.error(err);
        }
        //ensure category items have specific properties
        res.body.data[0].should.have.property('name');
        res.body.data[0].name.should.equal('breakfast');
        res.body.data[1].should.have.property('name');
        res.body.data[1].name.should.equal('dinner');
        done();
      });
  });
});
