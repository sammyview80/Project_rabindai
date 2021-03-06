const express = require('express');


// Controllers
const {
    getCompanys,
    register,
    login,
    logout,
    getcompany
} = require('../controllers/company');

// Express router 
const router = express.Router();


// Advance Results 
const advanceResults = require('../middlewares/advanceResults');
const {protect, authorization} = require('../middlewares/auth');
const Company = require('../models/Company');

router
    .route('/')
    .get(protect, authorization('superadmin'), advanceResults(Company), getCompanys);

router
    .route('/register')
    .post(register);

router
    .route('/login')
    .post(login);

router 
    .route('/logout')
    .get(logout);

router 
    .route('/my')
    .get(protect, authorization('admin'), getcompany);

module.exports = router;