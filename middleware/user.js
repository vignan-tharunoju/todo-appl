const jwt = require('jsonwebtoken') ;
const dotenv = require("dotenv");
dotenv.config();

const JWT_PASS = process.env.JWT_PASSWORD ;

function userMiddleware(req, res, next) {
    // Implement user auth logic
    const token = req.headers.token ;
    const decodedData = jwt.verify(token, JWT_PASS) ;

    if (decodedData.email) {
        req.email = decodedData.email ;
        req.userId = decodedData.userId ;
        next() ;
    }
    else {
        res.json({
            message: "You are not logged in"
        })
    }
}

function credentials(req, res, next) {
    const email = req.headers.email ;
    const password = req.headers.password ;

    if (!email || !password) {
        if (!email) console.log("no email") ;
        if (!password) console.log("no email") ;
        res.json({
            message: "Fill the credentials"
        })
    }
    else next() ;
}


module.exports = {
    userMiddleware, 
    credentials
};