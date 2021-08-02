'use strict';

module.exports = function (app) {
    let assignmentHandler = require("../controllers/assignmentController"),
    accountHandler = require("../controllers/accountController");

    app.route('/course/:id/assignment')
        .post(assignmentHandler.createAssignment)
        .get(assignmentHandler.getAllAssignment);
    app.route('/course/:id/assignment/todolist')
        .get(assignmentHandler.getTodoList);
    app.route('/course/:id/assignment/:id_assignment/update')
        .put(accountHandler.loginRequired, assignmentHandler.update);
}