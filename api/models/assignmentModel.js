'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');
const assignmentModel = require('./assignmentModel');

module.exports = {
    createNewAssignment: function (assignment, course) {
        var time = new Date(); 
        const newAssignment = {
            id_course: new ObjectID(course),
            //maker_email: 
            title: assignment.title,
            description: assignment.description,
            date: time.getDate()        + "-" + 
                    time.getMonth()     + "-"  + 
                    time.getFullYear()  + " " + 
                    time.getHours()     + ":" + 
                    time.getMinutes()   + ":" + 
                    time.getSeconds(),
            deadline:new Date(),
            attachment: assignment.attachment,
            submissions: [],
            comments: []
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