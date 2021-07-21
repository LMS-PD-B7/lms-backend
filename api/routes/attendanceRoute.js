module.exports = function (app) {
    let attendanceHandler = require("../controllers/attendanceController");

    app.route('/attendance')
        .post(attendanceHandler.createAttendance)
        .get(attendanceHandler.getAllAttendance);
}