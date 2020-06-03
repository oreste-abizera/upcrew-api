const { User, validateUser } = require("../models/User")
const { hashPassword } = require("../utils/hash.js")
const { getUserUniqueness, checkValidUser } = require("../utils/functions")
const ErrorResponse = require("../utils/ErrorResponse")
const { asyncHandler } = require("../middlewares/async")

// @desc                getting all users
//@route                GET /api/v1/users
// @access              private route
exports.getUsers = asyncHandler(async (req, res, next) => {
    let users = await User.find()
    if (!users) {
        return next(new ErrorResponse("no users found", 404))
    }
    res.send({
        success: true,
        count: users.length,
        data: users
    })
})




// @desc                getting single user
//@route                GET /api/v1/users/:id
// @access              private route
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    // let user = await User.findById(req.params.id)
    let user = await checkValidUser(req.params.id)
    if (!user.valid) {
        return next(new ErrorResponse(`user with id ${req.params.id} not found`, 404))
    }
    res.send({
        success: true,
        data: user.user
    })
})




// @desc                create new user
//@route                POST /api/v1/users
// @access              public route
exports.createUser = asyncHandler(async (req, res, next) => {

    //create user
    let { value: newUser, error } = validateUser(req.body)
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400))
    }


    if (newUser.gender !== "") newUser.gender = newUser.gender.toLowerCase()
    newUser.userPassword = await hashPassword(newUser.userPassword)

    //@check uniqueness of the user details
    let checkUnique = await getUserUniqueness(newUser)
    if (checkUnique.unique === false) {
        next(new ErrorResponse(checkUnique.message, 400))
    }
    newUser = await User.create(newUser)
    res.status(201).send({
        success: true,
        data: newUser
    })

    //end of create user
})





// @desc                updating user info
//@route                PUT /api/v1/users/:id
// @access              private route
exports.updateUser = asyncHandler(async (req, res, next) => {
    // const user = await User.findById(req.params.id)
    let user = await checkValidUser(req.params.id)
    if (!user.valid) {
        return next(new ErrorResponse(`user with id ${req.params.id} not found`, 404))
    }


    let updates = { ...req.body }
    if (updates.userPassword) {
        updates.userPassword = await hashPassword(updates.userPassword)
    }

    //validating father and mother
    if (updates.father) {
        let father = await checkValidUser(updates.father)
        if (!father.valid) {
            return next(new ErrorResponse(`father id '${updates.father}' not registered to any account`, 400))
        }
        if (father.user.gender !== "male") {
            return next(new ErrorResponse(`father provided is not male`, 400))
        }
    }

    if (updates.mother) {
        let mother = await checkValidUser(updates.mother)
        if (!mother.valid) {
            return next(new ErrorResponse(`mother id '${updates.mother}' not registered to any account`, 400))
        }
        if (mother.user.gender !== "female") {
            return next(new ErrorResponse(`mother provided is not female`, 400))
        }
    }



    updates = await User.findByIdAndUpdate(req.params.id, updates, { new: true })

    res.send({
        success: true,
        data: updates
    })
})



// @desc                delete user
//@route                DELETE /api/v1/users/:id
// @access              private route
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorResponse(`user with id ${req.params.id} not found`, 404))
    }
    await User.findOneAndDelete({ _id: req.params.id })
    res.send({
        success: true,
        data: {}
    })
})