const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');


// Custom validator for mongooseSchema 
const uniqueNameValidator = () =>  async function(v){
    const count = await mongoose.models.Companys.countDocuments({name: v });
    if(count > 0){
        return Promise.reject(new ApiError(409, `Duplicate name`))
    }
}

const CompanySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Company name is required.'],
        unique: true,
        validate: {
            // Validation for unique name
            validator: uniqueNameValidator()
        }
    },
    status: {
        type: String, 
        enum: ['open', 'closed'],
        default: 'open'
    },
    slug: String,

    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description  cannot be more than 50 characters.']
    },
    contact: {
        type: Number,
        required: [true, 'Contact Number is required.']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email.'
        ]
    },
    address: {
        type: String,
        required: [true, 'Address is required.']
    },
    authorization: {
        type: String,
        default: 'admin'
    },
    logo: {
        type: String,
        default: 'no-photo.jpg'
    },
    panNo: {
        type: Number,
        required: [true, 'Pan Number required.'],
    },
    regNo: {
        type: Number,
        required: [true, 'Register Number required.'],
    },
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: 6,
        select: false //Not gonna send in response
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

// Encrypt password using bcryptjs
CompanySchema.pre('save', async function(next) {
    // This gonna run when password is not changed or mordified.
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// User method using .methods 
CompanySchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
CompanySchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate and hash reset password token
CompanySchema.methods.getResetPasswordToken = function(){
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Has token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');


    // Set the expire for reset token
    this.resetPasswordExpire = Date.now() + 10 * 60 *1000;

    return resetToken;
}

module.exports = mongoose.model('Companys', CompanySchema);
