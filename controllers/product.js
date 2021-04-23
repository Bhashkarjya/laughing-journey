const Product = require('../models/product');
const formidable = require('formidable');
const lodash = require('lodash');
const fs = require('fs');
const { errorHandler } = require('../helper/dbErrorHandler');

exports.productById = (req,res,next,id) => {
    Product.findById(id).exec((err,product) => {
        if(err || !product){
            return res.status(400).json({
                error: "No product found"
            });
        }
        req.product = product;
        next();
    })
}

exports.create = (req,res) => {
    var form = new formidable.IncomingForm();
    //keeping the extensions that come with the pic like jpg,png intact
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {name,description,price,quantity,category,shipping} = fields;
        if(!name || !description || !price || !quantity || !category || !shipping)
        {
            return res.status(400).json({
                err: "All fields are mandatory"
            });
        }

        var product = new Product(fields);
        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    err: "Image size must be less than 1Mb"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err,result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({ result });
        });
    });
}

exports.read = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.deleteProduct = (req,res) => {
    var product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            name: deletedProduct.name,
            message: "The product has been deleted"
        });
    })
}

exports.updateProduct = (req,res) => {
    var form = new formidable.IncomingForm();
    //keeping the extensions that come with the pic like jpg,png intact
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        const {name,description,price,quantity,category,shipping} = fields;
        if(!name || !description || !price || !quantity || !category || !shipping)
        {
            return res.status(400).json({
                err: "All fields are mandatory"
            });
        }

        var product = req.product;
        product = lodash.extend(product,fields);
        //extend function in the lodash package helps to update the product

        if(files.photo){
            if(files.photo.size > 1000000){
                return res.status(400).json({
                    err: "Image size must be less than 1Mb"
                });
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }
        product.save((err,result) => {
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json({ result });
        });
    });
}