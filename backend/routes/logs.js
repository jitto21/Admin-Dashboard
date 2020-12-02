const express = require('express');
const router = express.Router();

var fs = require('fs');
var appRoot = require('app-root-path');
var byline = require('byline');

const checkAuth = require('../middlewares/check-auth');

router.get('/fetch', checkAuth, (req, res, next) => {
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
                message: 'Log Files Fetched',
                result: logArr
            });
        })
    } else {
        res.status(500).json({
            message: 'User Not Authorized to Fetch Files: ',
            result: 'k'
        })
    }
})

module.exports = router;
