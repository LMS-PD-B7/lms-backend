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

exports.unenrollCourse = function (req, res,stat) {
    let query = { email: student.email }
    let values = {
        $pull: { courseList: {
                    id_course: req.params.id,
                    status: stat
                }
            }
    };
    acc_db_connect.updateOne(query, values, {}, function (err, account) {
        if (err) {
            return res.status(400).send({ message: err })
        }
        return res.status(200).json({ message: 'User Updated' });
    });
}

exports.deleteCourse = async function (req, res) {
    if (req.account) {
        let db_connect = courseModel.connectDb();
        let acc_db_connect = accountModel.connectDb();

        let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

        if (!course || course.teacher[0] !== req.account.email) {
            return res.status(400).send({ message: "Not authorized" });
        }

        for (const teacher of course.teacher) {
            let teacherQuery = { email: teacher.email }
            let teacherValues = {
                $pull: { courseList: {
                            id_course: req.params.id,
                            status: "Teacher"
                        }
                    }
            };
            acc_db_connect.updateOne(teacherQuery, teacherValues, {}, function (err, account) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
        }

        for (const student of course.student) {
            let studentQuery = { email: student.email }
            let studentValues = {
                $pull: { courseList: {
                            id_course: req.params.id,
                            status: "Student"
                        }
                    }
            };
            acc_db_connect.updateOne(studentQuery, studentValues, {}, function (err, account) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
        }

        const query = { _id: new ObjectID(req.params.id) };

        db_connect.remove(query, 1, function (err, course) {
            if (err) {
                return res.status(400).send({ message: err });
            }

            return res.status(200).send({ message: 'Course deleted' });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }

}