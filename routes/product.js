const express = require('express');
const router = express.Router();
const {
    create, 
    productById, 
    read, 
    deleteProduct, 
    updateProduct, 
    productList, 
    relatedProducts,
    usedCategoryList,
    listBySearch,
    showPhoto
} = require('../controllers/product');
const {requireSignIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.delete('/product/:productId/:userId', requireSignIn,isAuth,isAdmin,deleteProduct);
router.put('/product/:productId/:userId', requireSignIn,isAuth,isAdmin,updateProduct);
router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin,create);
router.post('/product/by/search', listBySearch);
router.get('/product', productList);
router.get('/product/categories', usedCategoryList);
router.get('/product/related/:productId', relatedProducts);
router.get('/product/:productId', read);
router.get('/product/photo/:productId', showPhoto);

router.param('userId', userById);
router.param('productId',productById);
module.exports = router;