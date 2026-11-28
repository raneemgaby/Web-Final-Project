//centralized error handling middlerware
export default function errorHandler(err, req, res, next) {
    console.error(err.message);
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || err.statusCode || 500;

    return res.status(statusCode).json({message: statusCode>=500 ? "Internal server error.": "Invalid request."});
}
