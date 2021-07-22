'use strict';

module.exports = function (app) {
    let assignmentHandler = require("../controllers/assignmentController");

    app.route('/assignment')
        .post(assignmentHandler.createAssignment)
        .get(assignmentHandler.getAllAssignment);
}