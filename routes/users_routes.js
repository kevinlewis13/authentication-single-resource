'use strict';

var User = require('../models/User');
var bodyparser = require('body-parser');

module.exports = function(router, passport) {
  router.use(bodyparser.json());

  router.post('/create_user', function (req, res) {
    //removes reference assignment
    var newUserData = JSON.parse(JSON.stringify(req.body));
    delete newUserData.email;
    delete newUserData.password;

    var newUser = new User(newUserData);
    newUser.basic.email = req.body.email;
    newUser.generateHash(req.body.password, newUser.generateSalt(), function (err, hash) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'could not generate hash'});
      }

      newUser.basic.password = hash;

      //console.log(hash + ' HASH');

    });
    newUser.save(function (err, user) { //does this get put inside async function?
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'could not create user'});
      }

      user.generateToken(process.env.APP_SECRET, function (err, token) {
        if (err) {
          console.log(err);
          return res.status(500).json({msg: 'error generating token'});
        }

        res.json({token: token});
      });
    });
  });

  router.get('/log_in', passport.authenticate('basic', {session: false}), function (req, res) {

    req.user.generateToken(process.env.APP_SECRET, function (err, token) {
      if (err) {
        console.log(err);
        res.status(500).json({msg: 'error generating token'});
      }

      res.json({token: token});
    });
  });
};
