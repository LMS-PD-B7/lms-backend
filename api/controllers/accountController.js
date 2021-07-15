'use strict';

var jwt = require('jsonwebtoken'),
    accountModel = require("../models/accountModel"),
    { ObjectID } = require('mongodb');

module.exports = {
    register: function (req, res) {
        let db_connect = accountModel.connectDb();
        db_connect.insertOne(accountModel.createNewAccount(req.body), function (err, account) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                return res.status(200).send({
                    message: "Account registered successfully"
                });
            }
        });
    },


    getAllAccount: function (req, res) {
    // TEMPORARY (HANYA UNTUK TESTING)
        let db_connect = accountModel.connectDb();

        db_connect.find({}).toArray(function (err, account) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send(account);
            }
        })
    },

    login: function (req, res) {
        let db_connect = accountModel.connectDb();

        db_connect.findOne({
            email: req.body.email
        }, function (err, account) {
            if (err) {
                throw err;
            }

            if (!account || !accountModel.comparePassword(req.body.password, account.password)) {
                return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
            }

            return res.json({ token: jwt.sign({ email: account.email, display_name: account.display_name, course_list: account.course_list, _id: account._id }, 'RESTFULAPIs') });
        });
    },

    loginRequired: function (req, res, next) {
        if (req.account) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized user!!' });
        }
    },

    profile: function (req, res) {
        if (req.account) {
            res.send(req.account);
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    },

    update: function (req, res) {
        if (req.account) {
            let db_connect = accountModel.connectDb();
            console.log(req.account._id);
            let query = { _id: new ObjectID(req.account._id) };
            console.log(query);
            let values = {
                $set: accountModel.updateAccount(req.body)
            };

            db_connect.updateOne(query, values, function (err, account) {
                if (err) {
                    res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
        } else {
            return res.status(401).send({ message: 'Invalid token' });
        }
    }
};