'use strict';

process.env.MONGOLAB_URI = 'mongodb://localhost/books_test';
//does this create a new collection, or what?

require('../server');

var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var expect = chai.expect;
var User = require('../models/User');
var eat = require('eat');

chai.use(chaihttp);

describe('user manipulation tests', function () {
  var testToken;

  var testUser = new User({
    username: 'test user',
    basic: {
      password: '123test',
      email: 'tests@testss.com'
    }
  });

  beforeEach(function (done) {
    testUser.save(function (err, data) {
      if (err) throw err;

      eat.encode({id: testUser._id}, process.env.APP_SECRET, function (err, token) {
        if (err) throw err;
        testToken = token;
        done();
      });
    });
  });

  afterEach(function (done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should create a new user', function () {
    chai.request('localhost:3000')
      .post('/api/create_user')
      .send(testUser)
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
      });
  });

  it('should sign in a user', function () {
    chai.request('localhost:3000')
      .get('/api/log_in')
      .auth('tests@testss.com', '123test')
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
      });
  });
});
