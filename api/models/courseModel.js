'use strict';

var dbo = require('../../db/connection');

module.exports = {
    createNewCourse: function (course, account) {
        let newCourse = {
            title: course.title,
            description: course.description,
            enrollment_key: course.enrollment_key,
            teacher: [],
            student: [],
            assignments: [],
            attendances: [],
            discussions: []
        }
        newCourse.teacher.push(account.email);

        return newCourse;
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('courses');
    }

}