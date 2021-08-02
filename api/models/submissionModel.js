'use strict';

var dbo = require('../../db/connection');

module.exports = {
    createNewSubmission: function (submission, account) {
        let newSubmission = {
            email: account.email,
            submit_date:new Date(),
            status: submission.status
        }

        return newSubmission;
    },

    updateStatus: function (submission) {
        return {
            status:submission.status
        }
    },

    connectDb: function () {
        let db = dbo.getDb();

        if (db === undefined) {
            return null;
        }

        return db.collection('submission');
    }

}