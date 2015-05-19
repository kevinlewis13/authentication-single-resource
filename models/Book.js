'use strict';

var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  ownerId: {type: String, required: true},
  title: {type: String, required: true},
  author: {type: String, required: true},
  hardcover: String,
  purchase: {
    location: String,
    price: Number
  },
  edition: String
});

var Book = mongoose.model('Book', bookSchema);
//creates collection?

Book.schema.path('hardcover').validate(function (value) {
  return /true|false/i.test(value);
}, 'Value must be true or false');

// Book.schema.path('purchase.price').validate(function (value) {
//   return
// })

module.exports = Book;


