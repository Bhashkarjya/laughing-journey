const express = require('express');
const router = express.Router();
const {
    create, 
    categoryById, 
    readCategory, 
    updateCategory, 
    deleteCategory, 
    categoryList
} = require('../controllers/category');
const {
    requireSignIn, 
    isAuth, 
    isAdmin
} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/category/create/:userId', requireSignIn, isAuth, isAdmin,create);
router.get('/category/:categoryId',readCategory);
router.get('/categories',categoryList);
router.put('/category/:categoryId/:userId',requireSignIn, isAuth, isAdmin, updateCategory);
router.delete('/category/:categoryId/:userId',requireSignIn, isAuth, isAdmin, deleteCategory);

router.param('userId', userById);
router.param('categoryId',categoryById);

module.exports = router;