'use strict';

module.exports = function (app) {
    let attendanceHandler = require("../controllers/attendanceController"),
        accountHandler = require("../controllers/accountController");

    app.route('/attendance')
        .post(accountHandler.loginRequired, attendanceHandler.createAttendance)
        .get(attendanceHandler.getAllAttendances);
    app.route('/attendance/delete')
        .put(attendanceHandler.deleteAttendance);
   // app.route('')
}