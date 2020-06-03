const bcrypt = require("bcryptjs")

exports.hashPassword = async (password) => {
    let salt = await bcrypt.genSalt(10)
    let hashed = await bcrypt.hash(password, salt)
    return hashed
}