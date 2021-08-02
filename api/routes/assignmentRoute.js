'use strict';

module.exports = function (app) {
    let assignmentHandler = require("../controllers/assignmentController"),
        accountHandler = require("../controllers/accountController");

    app.route('/course/:id_course/assignment')
        .post(accountHandler.loginRequired, assignmentHandler.createAssignment)
        .get(accountHandler.loginRequired, assignmentHandler.getAssignmentinCourse);

    app.route('/course/:id_course/todolist')
        .get(accountHandler.loginRequired, assignmentHandler.getTodoList);

    app.route('/course/:id/assignment/:id_assignment/update')
        .put(accountHandler.loginRequired, assignmentHandler.update);

    app.route('/course/:id/assignment/:id_assignment/delete')
        .delete(accountHandler.loginRequired, assignmentHandler.deleteAssignment);
}