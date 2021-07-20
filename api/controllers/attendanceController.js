'use strict';

var attendanceModel = require("../models/attendanceModel");

exports.createAttendance = function (req, res) {
    let newAttendance = attendanceModel.createNewAttendance(req.body);
    // console.log(newAttendance);
    let db_connect = attendanceModel.connectDb();

    db_connect.insertOne(newAttendance, function (err, post) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return res.status(200).send({
                message: "Attendance created successfully"
            });
        }
    });
}

exports.getAllAttendances = function(req, res) {
    let db_connect = attendanceModel.connectDb();
  
    db_connect.find({}).toArray(function(err, attendance) {
      if (err) {
        return res.status(400).send({
          message:err
        })
      } else {
        return res.status(200).send(attendance);
      }
    })
  }