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

var Book = require('../models/Book');

describe('Book API', function() {
  var testToken;

  beforeEach(function (done) {

    var testUser = new User({
      username: 'test user',
      basic: {
        password: '123test',
        email: 'tests@testss.com'
      }
    });

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

  it('should create a new book entry', function (done) {
    chai.request('localhost:3000')
      .post('/api/books')
      .send({title: 'test title', author: 'test author', eat: testToken})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(res.body.title).to.eql('test title');
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should validate the hardcover value of new books', function (done) {
    chai.request('localhost:3000')
      .post('/api/books')
      .send({title: 'test title', author: 'test author', hardcover: 'yes', eat: testToken})
      .end(function (err, res) {
        expect(res.body.msg.errors.hardcover.message).to.eql('Value must be true or false');
        done();
      });
  });

  it('should return an array of book objects', function (done) {
    chai.request('localhost:3000')
      .get('/api/books')
      .send({eat: testToken})
      .end(function (err, res) {
        expect(err).to.eql(null);
        expect(typeof res.body).to.eql('object');
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  describe('needs existing books to work', function () {
    beforeEach(function (done) {
      var testBook = new Book({author: 'test author', title: 'test title', ownerId: '1234'});
      testBook.save(function (err, data) {
        if (err) console.log(err);

        this.testBook = data;
        done();
      }.bind(this));
    });

    it('should make a book in a before block', function() {
      expect(this.testBook.author).to.eql('test author');
      expect(this.testBook).to.have.property('_id');
    });

    it('should be able to update a book', function (done) {
      var bookId = this.testBook._id;
      chai.request('localhost:3000')
        .put('/api/books/' + bookId)
        .send({purchase: {location: 'test store'}, eat: testToken})
        .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('updated successfully');
          done();
        });
    });

      it('should validate updates', function (done) {
      var bookId = this.testBook._id;
      chai.request('localhost:3000')
        .put('/api/books/' + bookId)
        .send({hardcover: 'no', eat: testToken})
        .end(function (err, res) {
          expect(res.body.msg.errors.hardcover.message).to.eql('Value must be true or false');
          done();
        });
    });

    it('should be able to delete a book', function (done) {
      chai.request('localhost:3000')
        .del('/api/books/' + this.testBook._id)
        .send({eat: testToken})
        .end(function (err, res) {
          expect(err).to.eql(null);
          expect(res.body.msg).to.eql('deleted successfully');
          done();
        });
    });

  });
});
