const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var winston = require('../config/winston');
var morgan = require('morgan');
const User = require('../models/auth');
const checkAuth = require('../middlewares/check-auth');
const router = express.Router();

router.post('/signup', (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.pass, 10)
        .then(hashPass => {
            const user = new User({
                fname: req.body.fname,
                mname: req.body.mname,
                lname: req.body.lname,
                empid: req.body.empid,
                email: req.body.email,
                uname: req.body.uname,
                pass: hashPass,
                phone: req.body.phone,
                altPhone: req.body.altPhone,
                designation: req.body.designation,
                gender: req.body.gender,
                doj: req.body.doj,
                access: { users: false, location: false, survey: false, screen1: false, screen2: false, screen3: false, screen4: false, screen5: false, screen6: false }
            });
            user.save()
                .then(result => {
                    console.log(result);
                    winston.signuplogger.info(`CREATED-${new Date().toLocaleDateString()}-${new Date().toTimeString()}-${req.body.designation}-${user.empid}-${user.uname}-${req.body.doj}-${user.fname + ' ' + user.lname}`)
                    res.status(201).json({
                        message: 'User Created',
                    })
                })
                .catch(err => {
                    let errorMsg = err.message.split(':')
                    console.log(errorMsg[2])
                    res.status(500).json({
                        message: errorMsg[2]
                    })
                })
        })
        .catch(hashErr => {
            console.log("Error in hashing ", hashErr)
        })
})

router.post('/login', (req, res, next) => {
    User.findOne({ uname: req.body.uname })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "User Not Found"
                })
            }
            bcrypt.compare(req.body.pass, user.pass)
                .then(compareRes => {
                    if (!compareRes) {
                        return res.status(401).json({
                            message: "Login Failed"
                        })
                    }
                    winston.loginlogger.info(`IN-${new Date().toLocaleDateString()}-${new Date().toTimeString()}-${req.body.signinFrom}-${user.empid}-${user.uname}-${user.fname + ' ' + user.lname}`)
                    var token = jwt.sign(
                        {
                            uname: user.uname,
                            id: user._id
                        },
                        'this-is-my-secret-passcode',
                        {
                            expiresIn: '1h'
                        });
                    res.status(200).json({
                        message: 'Login Successfull',
                        token: token,
                        expiresIn: 3600,
                        userInfo: {
                          name: user.fname + ' ' + user.lname,
                          email: user.email,
                          access: user.access,
                        },
                        maxTimeout: 2
                    })
                })
                .catch(err => {
                    res.status(401).json({
                        message: "Login Failed"
                    })
                })
        })
        .catch(err => {
            res.status(401).json({
                message: "Login Failed"
            })
        })
});

router.get('/fetchUsers', checkAuth, (req, res, next) => {
    if (req.userData.uname === "admin") {
        User.find().then(users => {
            console.log("USERS=> ", users);
            const usersArr = users.filter(user => {
                return user.uname !== "admin"
            })
            return res.status(200).json({
                message: 'Users Fetched Successfully',
                users: usersArr
            })
        })
    } else {
        res.status(400).json({
            message: 'Acess Denied'
        })
    }
});

router.post('/changePermissions', checkAuth, (req, res, next) => {
    if (req.userData.uname !== "admin") {
        return res.status(400).json({
            message: 'Acess Denied'
        })
    }
    permiArr = req.body;
    console.log(permiArr);

    permiArr.forEach(permi => {
        const id = permi.id;
        delete permi.id;
        permi.users = false;
        User.findByIdAndUpdate(id, { access: permi })
            .then(result => {
                res.status(200).json({
                    message: 'Changes Made Successfully'
                })
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error in Changing Permissions: '+err
                })
            })
    });
});

router.post('/logout', checkAuth, (req, res, next) => {
    User.findOne({ uname: req.userData.uname })
        .then(user => {
            winston.loginlogger.info(`OUT-${new Date().toLocaleDateString()}-${new Date().toTimeString()}-${req.body.from}-${user.empid}-${user.uname}-${user.fname + ' ' + user.lname}`)
            res.status(200).json({
                message: 'User Logged Out'
            })
        }).catch(err => {
            res.status(500).json({
                message: 'Error in Logging Out'
            })
        })

})

module.exports = router;
