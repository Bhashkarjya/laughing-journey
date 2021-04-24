const { isUndefined } = require('lodash');
const User = require('../models/user');

exports.userById = (req,res,next,id) => {
    User.findById(id).exec((error,user) => {
        if(error || !user){
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next();
    });
}

exports.read = (req,res) => {
    req.profile.hashedPassword = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
}

exports.update = (req,res) => {
    User.findOneAndUpdate(
        {id: req.profile._id},
        {$set: req.body}, //setting the req.body to the req.profile data
        {new: true},
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "You are not authorized"
                });
            }
            user.profile.hashedPassword = undefined;
            user.profile.salt = undefined;
            res.json(user);
        }
    )
}