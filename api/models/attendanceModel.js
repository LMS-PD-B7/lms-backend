'use strict';

var dbo = require('../../db/connection');

module.exports = {
    createNewAttendance: function (attendance) {
        const newAttendance = {
            
        }

        return newAttendance;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('attendance');
    }

}