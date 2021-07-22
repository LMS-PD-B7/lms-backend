'use strict';

var dbo = require('../../db/connection');

module.exports = {
    createNewCommentDiscussion: function (comment, account) {
        let newComment = {
            email: account.email,
            date:new Date(),
            content: comment.content
        }

        return newComment;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('comment');
    }

}