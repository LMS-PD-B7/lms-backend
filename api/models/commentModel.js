'use strict';

var dbo = require('../../db/connection');

module.exports = {
    createNewComment: function (comment, account) {
        let newComment = {
            maker_email: account.email,
            date: time.getDate()    + "-" +
                (time.getMonth()+1) + "-" +
                time.getFullYear()  + " " +
                time.getHours()     + ":" +
                time.getMinutes()   + ":" +
                time.getSeconds(),
            content: comment.content,
            replyTo: comment.id_post
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