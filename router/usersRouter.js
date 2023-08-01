//external import
const express = require('express');
//internal import
const {
    getUsers,
    addUser,
    removeUser,
} = require('../controller/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const fieldUpload = require('../middlewares/users/fieldsUpload');
const {
    addUserValidators,
    addUserValidationHandler,
} = require('../middlewares/users/userValidators');

//create express router
const router = express.Router();

//Users page
router.get('/', decorateHtmlResponse('Users'), getUsers);
//add user
router.post(
    '/',
    fieldUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
);

//remove user
router.delete('/:id', removeUser);

module.exports = router;

// avatarUpload,
// addUserValidators,
// addUserValidationHandler,
// addUser
