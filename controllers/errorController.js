const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
    // Extract the duplicated field and its value from the `keyValue` property
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    // Create the error message with the duplicate field information
    const message = `Duplicate field value: "${value}" for field "${field}". Please use another value!`;
    return new AppError(message, 400);
};


const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Operational error
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Programming or unknown error
        console.error('ERROR:', err.message); // Avoid logging full error in prod
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// JWT error handlers with `new` keyword
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err); // Copy error properly
        error.message = err.message; // Explicitly copy the message
        
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        // Log a simplified error in production
        console.error("Error in production:", error.message);
        
        sendErrorProd(error, res);
    }
};
