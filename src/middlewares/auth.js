const ApiError = require("../errors/ApiError");
const asyncHandler = require("../helpers/asyncHandler");
const jwt = require('jsonwebtoken');
const Company = require("../models/Company");


// Protect routes
exports.protect = asyncHandler( async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        // Token from bearer authorization header
        token = req.headers.authorization.split(' ')[1];
    }else if (req.cookies){
        // Token from cookie
        token = req.cookies.token;
    }

    // Make sure token exist
    if(!token){
        return next(
            ApiError.unauthorized('Assess Denied.')
        )
    }
    try {
        // Verify token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.company = await Company.findById(decoded.id);
        next()
    } catch (err) {
        return next(
            ApiError.unauthorized('Assess Denied.')
        )
    }
});


// Authorizations
exports.authorization = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.company.authorization)){
            return next(
                ApiError.unauthorized(`Unauthorized.`)
            )
        }
        next();
    }
}

