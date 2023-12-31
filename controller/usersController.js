// external imports
const bcrypt = require('bcrypt');
const { unlink } = require('fs');
const path = require('path');

// internal imports
const User = require('../models/People');

// get users page
async function getUsers(req, res, next) {
    try {
        const users = await User.find();
        res.render('users', {
            users: users,
        });
    } catch (err) {
        next(err);
    }
}

/// add users
async function addUser(req, res, next) {
    // console.log(req.body);
    let newUser;

    try {
        // Generate a salt for hashing the password
        const saltRounds = 10;
        const myPlaintextPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(
            myPlaintextPassword,
            saltRounds
        );

        if (req.files && req.files.length > 0) {
            newUser = new User({
                ...req.body,
                avatar: req.files[0].filename,
                password: hashedPassword,
            });
        } else {
            newUser = new User({
                ...req.body,
                password: hashedPassword,
            });
        }
        //console.log(req.body);

        // Save user or send error
        const result = await newUser.save();
        console.log(result);

        res.status(200).json({
            message: 'User was added successfully',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occurred',
                },
            },
        });
    }
}

//remove user
async function removeUser(req, res, next) {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        });
        //remove user avatar if any
        if (user.avatar) {
            //call unlink
            unlink(
                path.join(
                    __dirname,
                    `/../public/uploads/avatars/${user.avatar}`
                ),
                (err) => {
                    if (err) console.log(err);
                }
            );
        }
        res.status(200).json({
            message: 'User was removed successfully',
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the user!',
                },
            },
        });
    }
}

module.exports = {
    addUser,
    getUsers,
    removeUser,
};
