function userSignUpValidator (req,res,next) {
    req.check('name','Name is empty').notEmpty();
    req.check('email','Email must be between 4 and 32 character')
    .matches(/.+\@.+\..+/)
    .withMessage('Email must contain @ symbol')
    .isLength({
        min: 4, max:32
    });
    req.check('password','Password is required').notEmpty()
    req.check('password')
    .isLength({
        min: 6
    })
    .withMessage('Password must contain atleast 6 characters')
    .matches(/\d/)//contains atleast one digit
    .withMessage("Password must contain a number");
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    next();
}

module.exports = {userSignUpValidator};