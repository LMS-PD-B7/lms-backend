'use strict';

var assignmentModel = require("../models/assignmentModel");

module.exports = {
    createAssignment : function (req, res) {
        let newAssignment = assignmentModel.createNewAssignment(req.body);
        
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
