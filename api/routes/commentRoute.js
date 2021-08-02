'use strict';

module.exports = function (app) {
    let commentHandler= require("../controllers/commentController"),
    accountHandler = require("../controllers/accountController");

    app.route('/comment')
        .post(accountHandler.loginRequired, commentHandler.createComment);
        // .get(accountHandler.loginRequired, commentHandler.getAllComment);
    app.route('/comment/:id')
        .delete(accountHandler.loginRequired, commentHandler.deleteComment);

    app.route('/assignment/:id_post/comment')
        .get(commentHandler.getComment);
    app.route('/discussion/:id_post/comment')
        .get(commentHandler.getComment);
}