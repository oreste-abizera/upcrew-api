const { asyncHandler } = require("../middlewares/async")
const ErrorResponse = require('../utils/ErrorResponse')
const { Course } = require('../models/Course')


// @desc                getting all courses
//@route                GET /api/v1/courses
// @access              private route
exports.getCourses = asyncHandler(async (req, res, next) => {
    let courses = await Course.find()
    if (!courses) {
        return next(new ErrorResponse("no courses found", 404))
    }
    res.json({
        success: true,
        count: courses.length,
        data: courses
    })
})


// @desc                getting single course
//@route                GET /api/v1/courses/:id
// @access              private route
exports.getCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse("Course not found", 404))
    }
    res.json({
        success: true,
        data: course
    })
})



// @desc                creating a course
//@route                POST /api/v1/courses
// @access              private route
exports.createCourse = asyncHandler(async (req, res, next) => {
    let { name, image } = req.body
    let finalCourse
    if (!image) {
        finalCourse = { name }
    } else {
        finalCourse = { name, image }
    }
    let course = await Course.create(finalCourse)
    res.json({
        success: true,
        data: course
    })
})


// @desc                updating a course
//@route                PUT /api/v1/courses/:id
// @access              private route
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let updates = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!updates) {
        return next(new ErrorResponse("Course not found", 404))
    }
    res.json({
        success: true,
        data: updates
    })
})


// @desc                deleting a course
//@route                DELETE /api/v1/courses/:id
// @access              private route
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    let deletedCourse = await Course.findByIdAndDelete(req.params.id)
    if (!deletedCourse) {
        return next(new ErrorResponse("Course not found", 404))
    }
    res.json({
        success: true,
        data: {}
    })
})