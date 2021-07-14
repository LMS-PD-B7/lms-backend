'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const discussionModel = require('./discussionModel');

module.exports = {
    createNewDiscussion: function (discussion, course) {
        const newDiscussion = {
            id_course: new ObjectID(course),
            title: discussion.title,
            description: discussion.description,
            date: new Date(),
            attachment: discussion.attachment,
            comments: []
        }

        return newDiscussion;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('discussion');
    }

}