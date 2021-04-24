const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            trim: true, //trims any spaces in the end or start of the string
            required: true, //required field
            maxLength: 32 
        },
        description: {
            type:String,
            required: true,
            maxLength: 2000
        },
        price: {
            type: Number,
            required: true,
            trim: true,
            maxLength: 10
        },
        quantity: {
            type: Number,
            required: true,
            maxLength: 10
        },
        sold: {
            type:Number,
            default: 0
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: true,
            type: Boolean
        }

    },
    {timestamp: true}
); 


module.exports = mongoose.model("product",productSchema);