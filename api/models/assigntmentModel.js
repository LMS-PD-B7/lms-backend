'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const assigntmentModel = require('./assigntmentModel');

module.exports = {
    createNewAssigntment: function (assigntment, course) {
        const newAssigntment = {
            id_course: new ObjectID(course),
            title: assigntment.title,
            description: assigntment.description,
            date: new Date(),
            attachment: assigntment.attachment,
            comments: []
        }

        return newAssigntment;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('assigntment');
    }

}