//external import
const express = require('express');
//internal import
const { getLogin, login } = require('../controller/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const {
    doLoginValidationHandler,
    doLoginValidators,
} = require('../middlewares/login/loginValidators');
const router = express.Router();

//set a page title
const page_title = 'Login';

//login page
router.get('/', decorateHtmlResponse(page_title), getLogin);

//process login
router.post(
    '/',
    decorateHtmlResponse(page_title),
    doLoginValidators,
    doLoginValidationHandler,
    login
);

module.exports = router;
