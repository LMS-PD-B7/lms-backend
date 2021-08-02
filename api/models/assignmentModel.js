'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');

module.exports = {
    createNewAssignment: function (assignment, course, account) {
        var time = new Date();
        const newAssignment = {
            id_course: new ObjectID(course._id),
            maker_email: account.email,
            title: assignment.title,
            description: assignment.description,
            date: time.getDate()    + "-" +
                (time.getMonth()+1) + "-" +
                time.getFullYear()  + " " +
                time.getHours()     + ":" +
                time.getMinutes()   + ":" +
                time.getSeconds(),
            deadline: new Date(assignment.deadline),
            attachment: assignment.attachment,
            submissions: []
        }

        return newAssignment;
    },

    updateAssignment: function (assignment) {
        var time = new Date();
        return {
            title: assignment.title,
            description: assignment.description,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-" + 
                    time.getFullYear()  + " " + 
                    time.getHours()     + ":" + 
                    time.getMinutes()   + ":" + 
                    time.getSeconds(),
            deadline:new Date(),
            attachment: assignment.attachment//,
            // comments: assignment.comments
        }
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('assignment');
    }
}