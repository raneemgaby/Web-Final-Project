//centralized error handling middlerware
export function errorHandler(err, req, res, next) {
    console.error(err.message);
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;

    return res.status(statusCode).json({message: statusCode>=500 ? "Internal server error.": "Invalid request."});
}

//not found error handler
export function notFound(req, res) {
    return res.status(404).json({message: "Endpoint not found.",method:req.method,path:req.path});
}