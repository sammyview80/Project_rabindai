// sendResponse helper function 
const {sendResponse} = require('../helpers/sendResponse');


// ApiError
const ApiError = require('../errors/ApiError');


// asyncHandler import 
const asyncHandler = require('../helpers/asyncHandler');


// Model company
const Company = require('../models/Company');
const sendTokenResponse = require('../helpers/sentTokenResponse');


//@des      Get all company 
//@route    GET /api/v1/company
//@access   Private-Admin
exports.getCompanys = asyncHandler( async (req, res, next) => {
    return sendResponse(res, res.advanceResults, 200, 'application/json')
});


//@des      Register company 
//@route    POST /api/v1/company/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) =>{
    const {name, address, regNo, panNo, email, password, contact, username, description} = req.body;

    // Create user
    const company = await Company.create({
        name,
        email,
        password,
        panNo,
        regNo,
        address,
        contact,
        description,
        username
    });
    return sendTokenResponse(company, 200, res);
});


//@des      Login company 
//@route    POST /api/v1/company/login
//@access   Public
exports.login = asyncHandler(async (req, res, next) =>{
    const {email, password} = req.body;

    // Validate email and password
    if(!email || !password){
        return next(
            new ApiError(400, 'Please provide an email and password')
        )
    }
    const company = await Company.findOne({email: email}).select('+password');

    // Check for user with email.
    if(!company){
        return next(
            ApiError.notfound('Invalid crediential.')
        )
    }
    // Check the password matched or not with the hashed password in db
    const isMatched = await company.matchPassword(password);

    // Sent Error to the client with code 400 invalid crediential.
    if(!isMatched){
        return next(
            ApiError.notfound('Invalid crediential.')
        )
    }
    // If passed all then send response token and set cookie is defaul in this function
    return sendTokenResponse(company, 200, res);
});


// @desc    Log company user out
// @route   POST /api/v1/company/logout
// @access  Private

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    return sendResponse(res, {
        status: "Succes",
        message: "Logout success."
    }, 200, 'application/json')
});



//@des      Get single company 
//@route    GET /api/v1/company/:id
//@access   Private
exports.getcompany = asyncHandler( async (req, res, next) => {
    return sendResponse(res, {
        status: "Sucess",
        data: req.company
    }, 200, 'application/json')
});