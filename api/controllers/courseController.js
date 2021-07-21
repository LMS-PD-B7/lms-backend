'use strict';

var courseModel = require("../models/courseModel"),
    accountModel = require("../models/accountModel"),
    { ObjectID } = require('mongodb');;

exports.updateCourseListAtAccount = function (req, res, course, status) {
    if (req.account) {
        let acc_db_connect = accountModel.connectDb();
        let query = { _id: new ObjectID(req.account._id) };
        let values = {
            $push: accountModel.updateCourseList(req.account, course.ops[0], status)
        };

        acc_db_connect.updateOne(query, values, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            return res.status(200).json({ message: 'User Updated' });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

exports.createCourse = function (req, res) {
    let newCourse = courseModel.createNewCourse(req.body, req.account);
    let db_connect = courseModel.connectDb();

    db_connect.insertOne(newCourse, function (err, course) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return exports.updateCourseListAtAccount(req, res, course, "Teacher");
        }
    });
}

exports.getAllCourses = function (req, res) {
    let db_connect = courseModel.connectDb();

    db_connect.find({}).toArray(function (err, course) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return res.status(200).send(course);
        }
    })
}