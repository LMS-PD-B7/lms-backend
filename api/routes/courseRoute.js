'use strict';

module.exports = function (app) {
    let courseHandler = require("../controllers/courseController");

    app.route('/course')
        .post(courseHandler.createCourse)
        .get(courseHandler.getAllCourses);
}