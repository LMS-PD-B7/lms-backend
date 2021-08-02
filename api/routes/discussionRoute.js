'use strict';

module.exports = function (app) {
    let discussionHandler = require("../controllers/discussionController"),
    accountHandler = require("../controllers/accountController");

    app.route('/course/:id/discussion')
        .post(accountHandler.loginRequired, discussionHandler.createDiscussion)
        .get(discussionHandler.getAllDiscussion);
    app.route('/course/:id/discussion/:id_discussion/update')
        .put(accountHandler.loginRequired, discussionHandler.update);
    app.route('/course/:id/discussion/:id_discussion/delete')
        .delete(accountHandler.loginRequired, discussionHandler.deleteDiscussion);
}