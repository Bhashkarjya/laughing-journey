const mongoose = require('mongoose');
//crypto module is used to hash the password
const crypto = require('crypto');
//use to generate unique strings 
const {v1: uuidv1} = require('uuid');

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true, //trims any spaces in the end or start of the string
            required: true, //required field
            maxLength: 32 
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: 40
        },
        hashedPassword: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true,
            maxLength: 60
        },
        salt: String, //used later to generate the Hashed Password
        role: {
            type: Number, // 0=standard user and 1= admin
            default: 0
        },
        history: {
            type: Array,  //store the last purchases of the user
            default: []
        }
    },
    {timestamp: true}
); 

//virtual Field
userSchema.virtual('password')
.set(function(password){
    this._password = password;
    this.salt = uuidv1();
    this.hashedPassword = this.encryptPassword(password);
}).get(function(){
    return this._password;
});

userSchema.methods = {

    authenticate: function(password){
        return this.encryptPassword(password) === this.hashedPassword;
    },

    encryptPassword: function(password){
        if(!password) return '';
        try{
            return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
        }
        catch(err){
            return '';
        }
    }
}

module.exports = mongoose.model("User",userSchema);