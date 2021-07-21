'use strict';

module.exports = function (app) {
    let discussionHandler = require("../controllers/discussionController");

    app.route('/discussion')
        .post(discussionHandler.createDiscussion)
        .get(discussionHandler.getAllDiscussion);
    app.route('/discussion/update')
        .put(discussionHandler.update);
}