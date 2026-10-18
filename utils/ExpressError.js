class ExpressError extends Error {
    constructor(message, stausCode){
        super();
        this.message = message;
        this.stausCode = statusCode;
    }
}

module.exports = ExpressError