//external Imports
const { check, validationResult } = require('express-validator');
const { unlink } = require('fs');
const path = require('path');
const createError = require('http-errors');
// internal imports
const User = require('../../models/People');

//add user validation
const addUserValidators = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .isAlpha({ locale: 'en-US', ignore: '-' }) // Enclose ignore property in an object
        .withMessage('Name must not contain anything other than alphabets')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Invalid email address')
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError('Email already is use!');
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check('mobile')
        .isMobilePhone('bn-BD', {
            strictMode: true,
        })
        .withMessage('Mobile number must be valid Bangladeshi mobile number')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw createError('Mobile number already is used');
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check('password')
        .isStrongPassword()
        .withMessage(
            'Password must be at least 8 charecters long & should contain at least 1 lowercase ,1 upercase, 1 number & 1 symbol'
        ),
];

const addUserValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped(); //for getting 'error' as object
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        //remove the uploaded file
        if (req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${filename}`),
                (err) => {
                    if (err) console.log(err);
                }
            );
        }
        //response the errors
        res.status(500).json({
            errors: mappedErrors,
        });
    }
};

module.exports = {
    addUserValidators,
    addUserValidationHandler,
};
