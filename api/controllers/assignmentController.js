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
        let course = await course_db_connect.findOne({ _id: new ObjectID(req.params.id) });
        console.log(course);
        console.log(req.account);
        let newAssignment = assignmentModel.createNewAssignment(req.body, course, req.account);

        let db_connect = assignmentModel.connectDb();

        db_connect.insertOne(newAssignment, function (err, assignment) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).json({ message: 'Assignment created successfully' });
                // return exports.updateAssignmentList(req, res, assignment.ops[0]);
            }
        });
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
}
