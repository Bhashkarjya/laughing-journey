const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true, //trims any spaces in the end or start of the string
            required: true, //required field
            maxLength: 32 
        }
    },
    {timestamp: true}
); 


module.exports = mongoose.model("Category",categorySchema);