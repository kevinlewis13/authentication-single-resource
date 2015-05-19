'use strict';

var Book = require('../models/Book');

var bodyparser = require('body-parser');

var eatAuth = require('../lib/eat_auth')(process.env.APP_SECRET);

var errorResponse = function(err, res) {
console.log(err);
return res.status(500).json({msg: err || 'server error, try again'});
};

module.exports = function (router) {
  router.use(bodyparser.json());

  router.get('/books', eatAuth, function (req, res) {
    Book.find({ownerId: req.user._id}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json(data);
    });
  });

  router.post('/books', eatAuth, function (req, res) {
    var newBook = new Book(req.body);
    newBook.ownerId = req.user._id;
    newBook.save({runValidators: true}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json(data);
    });
  });

  router.put('/books/:id', eatAuth, function (req, res) {
    var updatedBook = req.body;
    delete updatedBook._id;

    //runValidators option from http://stackoverflow.com/questions/15627967/why-mongoose-doesnt-validate-on-update
    Book.update({'_id': req.params.id}, updatedBook, {runValidators: true}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json({msg: 'updated successfully'});
    });
  });

  router.delete('/books/:id', eatAuth, function (req, res) {
    Book.remove({'_id': req.params.id}, function (err, data) {
      if (err) {
        errorResponse(err, res);
        return;
      }
      res.json({msg: 'deleted successfully'});
    });
  });

};
