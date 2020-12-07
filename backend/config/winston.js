var appRoot = require('app-root-path');
var winston = require('winston');

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Shanghai'
    });
  };

// define the custom settings for each transport (file, console)
var optionsApp = {
    file: {
        level: 'debug',
        filename: `${appRoot}/backend/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var optionsLogin = {
    file: {
        level: 'info',
        filename: `${appRoot}/backend/logs/login.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

var optionsSignup = {
  file: {
      level: 'info',
      filename: `${appRoot}/backend/logs/signup.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
  },
  console: {
      level: 'info',
      handleExceptions: true,
      json: false,
      colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
var applogger = winston.createLogger({
    transports: [
        new winston.transports.File(optionsApp.file),
        new winston.transports.Console(optionsApp.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

var loginlogger = winston.createLogger({
    transports: [
        new winston.transports.File(optionsLogin.file),
        new winston.transports.Console(optionsLogin.console)

    ],
    exitOnError: false, // do not exit on handled exceptions
});

var signuplogger = winston.createLogger({
  transports: [
      new winston.transports.File(optionsSignup.file),
      new winston.transports.Console(optionsSignup.console)

  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
applogger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        applogger.debug(message);
    }
};

loginlogger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        loginlogger.info(message);
    }
};

signuplogger.stream = {
  write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      signuplogger.info(message);
  }
};

module.exports = {
    applogger: applogger,
    loginlogger: loginlogger,
    signuplogger: signuplogger
};
