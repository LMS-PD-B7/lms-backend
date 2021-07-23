'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const discussionModel = require('./discussionModel');

module.exports = {
    createNewDiscussion: function (discussion, account, course) {
        var time = new Date();
        const newDiscussion = {
            id_course: new ObjectID(course._id),
            maker_email: account.email,
            title: discussion.title,
            content: discussion.content,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-" + 
                    time.getFullYear()  + " " + 
                    time.getHours()     + ":" + 
                    time.getMinutes()   + ":" + 
                    time.getSeconds(),
            attachment: discussion.attachment,
            comments: []
        }

        return newDiscussion;
    },

    updateDiscussion: function (discussion) {
        var time = new Date();
        return {
            title: discussion.title,
            description: discussion.description,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-" + 
                    time.getFullYear()  + " " + 
                    time.getHours()     + ":" + 
                    time.getMinutes()   + ":" + 
                    time.getSeconds(),
            attachment: discussion.attachment,
            comments: discussion.comments
        }
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('discussion');
    }

}