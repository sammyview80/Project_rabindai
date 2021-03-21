const express = require('express');

// Controllers
const {
    createUser
} = require('../controllers/user');

// Express router
const router = express.Router();

// Advance results
const advanceResults = require('../middlewares/advanceResults');
const { protect, authorization } = require('../middlewares/auth');
const User = require('../models/User');

router.use(protect);

router
    .route('/')
    .post(createUser)


module.exports = router;