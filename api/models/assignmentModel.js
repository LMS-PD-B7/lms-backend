'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const assignmentModel = require('./assignmentModel');

module.exports = {
    createNewAssignment: function (assignment, course, account) {
        var time = new Date(); 
        const newAssignment = {
            id_course: new ObjectID(course._id),
            maker_email: account.email,
            title: assignment.title,
            description: assignment.description,
            date: time.getDate()        + "-" + 
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

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('assignment');
    }

}