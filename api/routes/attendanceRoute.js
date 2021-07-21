'use strict';

module.exports = function (app) {
    let attendanceHandler = require("../controllers/attendanceController");

    app.route('/attendance')
        .post(attendanceHandler.createDiscussion)
        .get(attendanceHandler.getAllDiscussion);
    app.route('/attendance/update')
        .put(attendanceHandler.update);
   // app.route('')
}