const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');


const app = express();


// Custom imports 
const errorHandler = require('./src/errors/api-error-handler');


// Mongodb connection
const connectDB = require('./src/configs/db');


// Initialization of dotenv file
dotenv.config({
    path: './src/configs/config.env'
})


// Body parser
app.use(express.json());


// Cookies parser
app.use(cookieParser())


// Connection to the database
const db = connectDB();


// Router Imports 
const companysRouter = require('./src/routers/company');


// Using morgan for development
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Using middleware that give the instance of connectDB
app.use((req, res, next) => {
    req.db = db;
    next();
})


// Router middleware
app.use('/api/v1/companys', companysRouter);


// Error Handler 
app.use(errorHandler);


// Environment variables 
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    console.log(`Server Running in ${ENVIRONMENT} PORT ${PORT}. Link: http://localhost:${PORT}/`.yellow.bold)
})