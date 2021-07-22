'use strict';

var attendanceModel = require("../models/attendanceModel");
var courseModel = require("../models/courseModel");
var accountModel = require("../models/accountModel");
var submissionModel = require("../models/submissionModel");

exports.createSubmission = function (req, res) {
    if (req.user) {
      let db_connect = submissionModel.connectDb();
      let newSubmission = submissionModel.createNewSubmission(req.body, req.user);
  
      db_connect.insertOne(newSubmission, function (err, submission) {
        if (err) {
          return res.status(400).send({
            message: err
          })
        }
  
        const attendance_db_connect = attendanceModel.connectDb();
        const query = { _id: new ObjectID(req.body.post_id) };
        const new_values = {  };
  
        post_db_connect.updateOne(query, new_values, function (err, post) {
          if (err) {
            return res.status(400).send({ message: err });
          }
        });
  
        return res.status(200).send({
          message: "Submission created successfully"
        });
      })
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }