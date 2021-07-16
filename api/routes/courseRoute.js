'use strict';

module.exports = function (app) {
    let courseHandler = require("../controllers/courseController"),
        accountHandler = require("../controllers/accountController");

    app.route('/course')
        .post(accountHandler.loginRequired, courseHandler.createCourse)
        .get(courseHandler.getAllCourses);
}