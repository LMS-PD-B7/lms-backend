'use strict';

var dbo = require('../../db/connection'),
    { ObjectID } = require('mongodb');

module.exports = {
    createNewAttendance: function (attendance, account, course) {
        const newAttendance = {
            id_course: new ObjectID(course._id),
            maker_emal: new ObjectID(account.email),
            title: attendance.title,
            description: discussion.description,
            date: new Date(),
            late_limit: attendance.late_limit,
            deadline: new Date()
        }

        return newAttendance;
    },

    updateAttendance: function (attendance) {
        return {
            title: attendance.title,
            description: attendance.description,
            date: attendance.date
          }
    },


    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('attendance');
    }

}