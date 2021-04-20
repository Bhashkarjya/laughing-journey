const User = require('../models/user');
const {errorHandler} = require('../helper/dbErrorHandler');
const jwt = require('jsonwebtoken'); //to generate signed token
const expressJwt = require('express-jwt'); //for authorization check

function signUp(req,res){
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

function signIn(req,res){
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

function signOut(req,res){
    res.clearCookie('t');
    res.json({message: "Successfully signed out"});
}

module.exports = {signUp,signIn,signOut};