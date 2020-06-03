const ErrorResponse = require("../utils/ErrorResponse")
const ErrorHandler = (err, req, res, next) => {
    let error = { ...err }
    console.log("Error: \n")
    console.log(error)

    //mongoose bad objectId
    if (error.name === "CastError") {
        const message = `resource not found with id of ${error.value}`
        error = new ErrorResponse(message, 404)
    }

    if (error.code === 11000) {
        const message = "duplicate filed value entered"
        error = new ErrorResponse(message, 400)
    }

    if (error.errors) {
        if (error.errors.type.kind === "enum") {
            const message = `invalid value entered in field '${error.errors.type.path}'`
            error = new ErrorResponse(message, 400)
        }
    }

    return res.status(error.statusCode || 500).json({
        success: false,
        error: error.msg || "Server Error"
    })
}
module.exports = ErrorHandler