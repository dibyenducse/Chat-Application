const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if (cookies) {
        try {
            token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            //pass user info to response locals
            if (res.locals.html) {
                res.locals.loggedInUser = decoded;
            }
            next();
        } catch (err) {
            if (res.locals.html) {
                res.redirect('/');
            } else {
                res.status(500).json({
                    errors: {
                        common: {
                            msg: 'Authentication failure',
                        },
                    },
                });
            }
        }
    } else {
        if (res.locals.html) {
            res.redirect('/');
        } else {
            res.status(401).json({
                error: 'Authentication failure!',
            });
        }
    }
};

const redirectLoggedIn = function (req, res, next) {
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if (!cookies) {
        next();
    } else {
        res.redirect('/inbox');
    }
};

//gurad to protect routes that need role based authorization
function requireRole(role) {
    return function (req, res, next) {
        if (req.user.role && role.includes(req.user.role)) {
            next();
        } else {
            res.status(401).json({
                errors: {
                    common: {
                        msg: 'You are not authorized!',
                    },
                },
            });
        }
    };
}

module.exports = { checkLogin, redirectLoggedIn, requireRole };
