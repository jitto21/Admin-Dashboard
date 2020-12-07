const express = require('express');
const router = express.Router();

var fs = require('fs');
var appRoot = require('app-root-path');
var byline = require('byline');

const checkAuth = require('../middlewares/check-auth');


router.get('/fetch/signup', checkAuth, (req, res, next) => {
  if (req.userData.uname === "admin") {
      var logArr = [];
      var stream = byline(fs.createReadStream(`${appRoot}/backend/logs/signup.log`, { encoding: 'utf8' }));
      stream.on('data', (line) => {
          // console.log(line);
          logArr.push(line);
      })
      stream.on('end', () => {
          console.log("Stream has ended");
          // console.log(logArr);
          res.status(200).json({
              message: 'Signup Log Files Fetched',
              result: logArr
          });
      })
  } else {
      res.status(500).json({
          message: 'User Not Authorized to Fetch Signup Log Files: ',
          result: 'k'
      })
  }
})

router.get('/fetch/login', checkAuth, (req, res, next) => {
    if (req.userData.uname === "admin") {
        var logArr = [];
        var stream = byline(fs.createReadStream(`${appRoot}/backend/logs/login.log`, { encoding: 'utf8' }));
        stream.on('data', (line) => {
            // console.log(line);
            logArr.push(line);
        })
        stream.on('end', () => {
            console.log("Stream has ended");
            // console.log(logArr);
            res.status(200).json({
                message: 'Login Log Files Fetched',
                result: logArr
            });
        })
    } else {
        res.status(500).json({
            message: 'User Not Authorized to Fetch Login Log Files: ',
            result: 'k'
        })
    }
})

module.exports = router;
