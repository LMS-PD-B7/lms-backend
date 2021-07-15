'use strict';

var dbo = require('../../db/connection');
var bcrypt = require('bcrypt');

module.exports = {
    createNewAccount: function (account) {
        const newAccount = {
            email: account.email,
            display_name: account.display_name,
            password: bcrypt.hashSync(account.password, 10),
            course_list:[]
        }
        return newAccount;
    }
}