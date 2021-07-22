'use strict'

module.exports = function (app) {
    let accountHandler = require("../controllers/accountController");

    app.route('/auth/register')
        .post(accountHandler.register);
    app.route('/account')
        .get(accountHandler.getAllAccount);  //TESTING ONLY
    app.route('/auth/login')
        .post(accountHandler.login);
    app.route('/profile')
        .get(accountHandler.loginRequired, accountHandler.profile); // LOGIN ULANG DULU
    app.route('/auth/update')
        .put(accountHandler.loginRequired, accountHandler.update);

}