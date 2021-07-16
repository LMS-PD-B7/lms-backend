'use strict';

var courseModel = require("../models/courseModel"),
    accountModel = require("../models/accountModel");

module.exports = {
    createCourse: function (req, res) {
        let newCourse = courseModel.createNewCourse(req.body, req.account);
        let db_connect = courseModel.connectDb();
        // let newCourseList = accountModel.updateCourseList(req.body);

        db_connect.insertOne(newCourse, function (err, post) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send({
                    message: "Course created successfully"
                });
            }
        });
    },

    getAllCourses: function (req, res) {
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
}