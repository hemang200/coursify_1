const errorMiddleware = (err, req, res, next) => {
    //   console.error("Global error handler:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message,
        stack: err.stack,
    });
};
export default errorMiddleware;