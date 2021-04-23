const User = require('../models/user');
const {errorHandler} = require('../helper/dbErrorHandler');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //for authorization check
const { restart } = require('nodemon');

exports.signUp = (req,res) => {
    // console.log(req.body);
    const user = new User(req.body);
    user.save((error,user)=> {
        if(error){
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        user.salt = undefined;
        user.hashedPassword = undefined;
        res.json({user});
    });
}

exports.signIn = (req,res) => {
    //find the user based on email
    const {email,password} = req.body;
    User.findOne({email}, (error,user) => {
        if(error || !user){
            return res.status(400).json({error: "User with such an email doesn't exist. Kindly signUp first."})
        }
        //if user is found, make sure the email and password exist.
        //create authenticate method in user model
        if(user.authenticate(password) == false){
            return res.status(401).json({
                error: "The email and password doesn't match"
            })
        }
        //destructure the user to get the details
        const {_id,email,name,role} = user;
        //generate a signed token with user id and secret token
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET);
        //persist the token as 't' in the cookie with expiry date
        res.cookie('t',token,{expire: new Date()+9999});
        return res.json({token, user: {_id,email,name,role}});
    });
}

exports.signOut = (req,res) => {
    res.clearCookie('t');
    res.json({message: "Successfully signed out"});
}

exports.requireSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
});

//to make sure that a person can access only his own account using the token and not access someone else's account
// for eg A shouldn't have access to B's account
exports.isAuth = (req,res,next) => {
    var user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
        return res.status(403).json({
            error: "Acccess denied"
        })
    }
    next();
}

//to protect the admin routes
exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
        //the role is defined as 0 by default. Admin needs to have 1 as a role
        return res.status(403).json({
            error: "You do not have access to admin resources"
        });
    }
    next();
}
