const Product = require('../models/product');
const Category = require('../models/category');
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

exports.productList = (req,res) => {
    var order = req.query.order ? req.query.order : "asc";
    var limit = req.query.limit ? parseInt(req.query.limit) : 6;
    var sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("-photo") //selecting all the attributes except photo
        .populate("Category") //populating the Category fieled
        .sort([[sortBy, order]]) //sorting by given attribute and by the specific order
        .limit(limit) //limiting the number of rows returned from the database
        .exec((err,data) => {
            if(err){
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            res.json(data);
        });
}

exports.relatedProducts = (req,res) => {
    var limit = req.query.limit ? parseInt(req.query.limit): 6;
    //Find all the related products of the same category except the product whose productId has been 
    // provided as a query parameter
    //$ne: req.product this line ensures that we do not output the same product once again
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .select("-photo")
    .limit(limit)
    .populate('category', '_id name')
    .exec((err,product) => {
        if(err){
            return res.status(400).json({
                error: "No related products found"
            });
        }
        res.json({product});
    });
}

exports.usedCategoryList = (req,res) => {
    Product.distinct('category', {}, (err,category) => {
        if(err){
            return res.status(400).json({
                error: "No category found"
            });
        }
        res.json(category);
    });
}

exports.listBySearch = (req,res) => {
    var order = req.body.order ? req.body.order: "asc";
    var limit = req.body.limit ? req.body.limit: 100;
    var sortBy = req.body.sortBy ? req.body.sortBy: "_id";
    var skip = parseInt(req.body.skip);
    var findArgs = {}; //findArgs contain the categoryId and the price range

    console.log(order,limit,sortBy, req.body.filters);

    for( var key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=='price'){
                findArgs[key]={
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else
                findArgs[0]=req.body.filters[0];
        }
    }

    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .limit(limit)
    .skip(skip)
    .exec((err,data) => {
        if(err){
            return res.status(400).json({
                error: "No product found"
            });
        }
        res.json({
            size: data.length,
            data
        });
    });
}

exports.showPhoto = (req,res,next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}