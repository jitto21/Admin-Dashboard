const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var morgan = require('morgan');

var winston = require('./config/winston');
const app = express();

const logRoutes = require('./routes/logs');
const authRoutes = require('./routes/auths');
const mongoUrl = "mongodb://127.0.0.1:27017/jiju-project"

mongoose.connect(mongoUrl, {useNewUrlParser: true,  useUnifiedTopology: true})
.then(()=>console.log("DB Connected"))
.catch((err)=> console.log("Error in DB Connection"+err))

// app.use(morgan('combined', {stream: winston.applogger.stream}));

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type,Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    next();
})

app.use('/auth', authRoutes);
app.use('/log', logRoutes);

module.exports = app;