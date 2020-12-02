const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'this-is-my-secret-passcode');
        req.userData = {uname: decodedToken.uname, id: decodedToken.id};
        next();
    }
    catch(err) {
        console.log("Error in CheckAuth")
        res.status(401).json({
            message: 'Error in Authorization'
        })
    }
}