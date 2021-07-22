'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const discussionModel = require('./discussionModel');

module.exports = {
    createNewDiscussion: function (discussion, course) {
        var time = new Date(); 
        const newDiscussion = {
            id_course: new ObjectID(course),
            //maker_email: 
            title: discussion.title,
            description: discussion.description,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-"  + 
                    time.getFullYear()  + " " + 
                    time.getHours()     + ":" + 
                    time.getMinutes()   + ":" + 
                    time.getSeconds(),
            attachment: discussion.attachment,
            comments: []
        }

        return newDiscussion;
    },

    updateDiscussion: function (discussion, course) {
        return {
            id_course: discussion.id_course,
            title: discussion.title,
            description: discussion.description,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-"  + 
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