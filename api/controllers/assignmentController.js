'use strict';

var assignmentModel = require("../models/assignmentModel");
var courseModel = require("../models/courseModel");
const { ObjectID } = require("mongodb");

module.exports = {
    createAssignment : async function (req, res) {
        let course_db_connect = courseModel.connectDb();
        let course = await course_db_connect.findOne({_id: new ObjectID(req.params.id)});
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
                return res.status(200).send({
                    message: "Assignment created successfully"
                });
            }
        });
    },

    getAllAssignment : function(req, res) {
        let db_connect = assignmentModel.connectDb();
      
        db_connect.find({}).toArray(function(err, assignment) {
            if (err) {
                return res.status(400).send({
                    message:err
                })
            } else {
                return res.status(200).send(assignment);
            }
        })
    },
}
