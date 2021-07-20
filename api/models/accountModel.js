'use strict';

var dbo = require('../../db/connection'),
    bcrypt = require('bcrypt');

module.exports = {
    createNewAccount: function (account) {
        let newAccount = {
            email: account.email,
            display_name: account.display_name,
            password: bcrypt.hashSync(account.password, 10),
            course_list: []
        }
        return newAccount;
    },

    comparePassword: function (password, hash_password) {
        return bcrypt.compareSync(password, hash_password);
    },

    updateAccount: function (account) {
        return {
            display_name: account.display_name,
            password: bcrypt.hashSync(account.password, 10)
        }
    },

    updateCourseList: function (account, course, stat) {
        return {
            course_list: {
                id_course: course._id,
                status: stat
            }
        }
        // return {
        //     course_list: account.course_list.push({
        //         id_course: course._id,
        //         course_title: course.title,
        //         status: stat
        //     })
        // }
        // account.course_list.push()
        // course_list.push({
        //     id_course: course._id,
        //     status: stat
        // })
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('account');
    }
}