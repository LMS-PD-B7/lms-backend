'use strict';

module.exports = function (app) {
    let courseHandler = require("../controllers/courseController"),
        accountHandler = require("../controllers/accountController");

    app.route('/course')
        .post(accountHandler.loginRequired, courseHandler.createCourse)
        .get(courseHandler.getAllCourses);
    app.route('/course/:id/delete')
        .post(accountHandler.loginRequired, courseHandler.deleteCourse);
    app.route('/course/:id/unenroll')
        .post(accountHandler.loginRequired, courseHandler.unenrollCourse);
}