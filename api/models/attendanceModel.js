'use strict';

const { ObjectID } = require('mongodb');
var dbo = require('../../db/connection');

module.exports = {
    createNewAttendance: function (attendance, account, course) {
        const newAttendance = {
            id_course: new ObjectID(course._id),
            maker_email: new ObjectID(account.email),
            title: attendance.title,
            description: attendance.description,
            date: new Date(),
            late_limit: attendance.late_limit,
            deadline: new Date(),
            submission: []
        }

        return newAttendance;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('attendance');
    },

    updateAttendance: function (attendance) {
        return {
            title: attendance.title,
            description: attendance.description,
            deadline: new Date()
        }
    }

}