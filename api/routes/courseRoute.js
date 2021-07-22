'use strict';

module.exports = function (app) {
    let courseHandler = require("../controllers/courseController"),
        accountHandler = require("../controllers/accountController");

    app.route('/course')
        .post(accountHandler.loginRequired, courseHandler.createCourse)
        .get(courseHandler.getAllCourses);

    app.route('/course/:id')
        .get(accountHandler.loginRequired, courseHandler.getCourse);
    app.route('/course/:id/student')
        .get(accountHandler.loginRequired, courseHandler.getStudents);
    app.route('/course/:id/teacher')
        .get(accountHandler.loginRequired, courseHandler.getTeachers);

    app.route('/course/:id/add/student')
        .post(accountHandler.loginRequired, courseHandler.addStudent);
    app.route('/course/:id/add/teacher')
        .post(accountHandler.loginRequired, courseHandler.addTeacher);
    app.route('/course/:id/enroll')
        .post(accountHandler.loginRequired, courseHandler.enroll);

    app.route('/course/:id/delete')
        .post(accountHandler.loginRequired, courseHandler.deleteCourse);
    app.route('/course/:id/unenroll')
        .post(accountHandler.loginRequired, courseHandler.unenrollCourse);
}