'use strict';

var assignmentModel = require("../models/assignmentModel");
var courseModel = require("../models/courseModel");
const { ObjectID } = require("mongodb");


exports.updateAssignmentList = async function (req, res, assignment) {
    let course_db_connect = courseModel.connectDb();
    let course = await course_db_connect.findOne({ _id: new ObjectID(req.params.id) });
    if (course) {
        let query = { _id: new ObjectID(req.params.id) };
        let values = {
            $push: { assignments: new ObjectID(assignment._id) }
        };

        course_db_connect.updateOne(query, values, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            return res.status(200).json({ message: "Assignment list Updated" });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = {
    createAssignment: async function (req, res) {
        let course_db_connect = courseModel.connectDb();
        let course = await course_db_connect.findOne({ _id: new ObjectID(req.params.id_course) });
        console.log(course);

        if (course) {
            if (course.teacher.includes(req.account.email)) {
                let newAssignment = assignmentModel.createNewAssignment(req.body, course, req.account);

                let db_connect = assignmentModel.connectDb();

                db_connect.insertOne(newAssignment, function (err, assignment) {
                    if (err) {
                        return res.status(400).send({
                            message: err
                        })
                    } else {
                        return res.status(200).json({ message: 'Assignment created successfully' });
                    }
                });
            } else {
                return res.status(200).json({ message: 'Not authorized!' });
            }

        } else {
            return res.status(200).json({ message: 'Course not found' });
        }
    },

    getAllAssignment: function (req, res) {
        let db_connect = assignmentModel.connectDb();

        db_connect.find({}).toArray(function (err, assignment) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send(assignment);
            }
        })
    },

    getAssignmentinCourse: function (req, res) {
        let db_connect = assignmentModel.connectDb();
        const query = {
            id_course: new ObjectID(req.params.id_course)
        }
        db_connect.find(query).toArray(function (err, assignment) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send(assignment);
            }
        })
    },

    getTodoList: function (req, res) {
        let db_connect = assignmentModel.connectDb();
        let query = {
            submissions: {
                $not: {
                    email: req.account.email
                }
            }
        };
        db_connect.findOne(query).toArray(function (err, assignment) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send(assignment);
            }
        })
    },

    update: async function (req, res) {
        let assignment_db_connect = assignmentModel.connectDb();
        let assignment = await assignment_db_connect.findOne({ _id: new ObjectID(req.params.id_assignment) });
        if (assignment) {
            if (req.account.email === assignment.maker_email) {
                let db_connect = assignmentModel.connectDb();
                let query = { _id: new ObjectID(req.params.id_assignment) };
                let values = {
                    $set: assignmentModel.updateAssignment(req.body)
                };

                db_connect.updateOne(query, values, function (err, assignment) {
                    if (err) {
                        return res.status(400).send({ message: err })
                    }
                    return res.status(200).json({ message: 'Assignment Updated' });
                });
            } else {
                return res.status(200).send({ message: 'Not authorized' });
            }
        } else {
            return res.status(401).send({ message: 'Invalid token' });
        }
    },

    deleteAssignment: async function (req, res) {
        let db_connect = assignmentModel.connectDb();
        let assignment = await db_connect.findOne({ _id: new ObjectID(req.params.id_assignment) });
        if (assignment) {
            if (req.account.email === assignment.maker_email) {
                const query = { _id: new ObjectID(req.params.id) };
                db_connect.remove(query, 1, function (err, assignment) {
                    if (err) {
                        return res.status(400).send({ message: err });
                    } else {
                        return res.status(200).send({ message: 'Assignment deleted' });
                    }
                });
            } else {
                return res.status(200).send({ message: 'Not authorized' });
            }
        } else {
            return res.status(401).send({ message: 'Assignment not found' });
        }
    }
}
