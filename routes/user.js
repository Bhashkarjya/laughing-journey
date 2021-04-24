const express = require('express');
const router = express.Router();
const {userById, read, update} = require('../controllers/user');
const {requireSignIn, isAuth, isAdmin} = require('../controllers/auth');

router.get('/secret/:userId',requireSignIn, isAuth, isAdmin, (req,res)=> {
    res.json({
        user: req.profile
    });
});

router.get('user/:userId', requireSignIn, isAuth, read);
router.put('user/:userId', requireSignIn, isAuth, update);
router.param('userId', userById);

module.exports = router;