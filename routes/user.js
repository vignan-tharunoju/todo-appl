const { Router } = require("express");
const router = Router();
const {userMiddleware, credentials} = require("../middleware/user");
const jwt = require('jsonwebtoken') ;
const mongoose = require('mongoose') ;
const dotenv = require("dotenv");
dotenv.config();
const { User, Todo } = require("../database");
const bcyrpt = require("bcyrpt");

const z = require("zod");

const JWT_PASS = process.env.JWT_PASSWORD ;

// User Routes

router.post('/signup', credentials, async (req, res) => {
    // Implement user signup logic
    const requiredBody = z.object({
        email : z.email().min(3).max(100),
        password : z.string().min(3).max(30) 
    })

    const parseData = userSchema.parse(req.body) ;

    if (!parseData.sucesss) {
        res.json({
            message : parseData.message 
        })
        return ;
    }

    const email = req.body.email ;
    const password = req.body.password ;

    try {
        const hash = await bcyrpt.hash(password, 5) ;

        await User.create({email, password : hash}) ;
        res.json({message : "You are signed up"}) ;
    }
    catch(e) {
        return res.json({message : e.message}) ;
    }
});

router.post('/login', credentials, async (req, res) => {
    // Implement user login logic
    const email = req.body.email ;
    const password = req.body.password ;

    const hash = await bcyrpt.hash(password, 5) ;
    const response = await User.find({email, password : hash}) ;

    const match = bcyrpt.compare(password, response.password) ; 

    if (match) {
        const token = jwt.sign({
            id : response._id.toString() 
        }, JWT_PASS) ;
        res.json({
            token
        })
    }
    else {
        res.status(403).json({
            message : "Incorrect credentials"
        })
    }

});

router.get('/todos', userMiddleware, async (req, res) => {
    // Implement logic for getting todos for a user  
    const userId = req.userId ;
    const todos = await Todo.find({userId : userId}) ;
    res.json({todos}) ;
});

router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
    localStorage.remove('token') ;
    res.json({message : "logged out"}) ;
});

module.exports = router