'use strict';

module.exports = function (app) {
    let commentHandler= require("../controllers/commentController"),
    accountHandler = require("../controllers/accountController");

    app.route('/comment')
        .post(accountHandler.loginRequired, commentHandler.createComment)
        .get(commentHandler.getAllComment);
    app.route('/comment/:id')
        .delete(accountHandler.loginRequired, commentHandler.deleteComment);
}