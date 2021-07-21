'use strict';

var attendanceModel = require("../models/attendanceModel");
const courseModel = require("../models/courseModel");
const accountModel = require("../models/accountModel");

exports.createAttendance = async function (req, res) {
    if (req.account) {
      let db_connect = attendanceModel.connectDb();
      let acc_db_connect = accountModel.connectDb();
      let course_db_connect = courseModel.connectDb();
      let newAttendance = attendanceModel.createNewAttendance(req.body);

      let course = await course_db_connect.findOne({ _id: new ObjectID(req.params.id) });

      if (!course || course.teacher[0] !== req.account.email) {
          return res.status(400).send({ message: "Not authorized" });
      }

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
    } else {
      return res.status(401).send({ message: 'Invalid token' });
  }
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

exports.deleteAttendance = async function(req, res) {
  if (req.account) {
    let db_connect = attendanceModel.connectDb();
    let course_db_connect = courseModel.connectDb();
    let acc_db_connect = accountModel.connectDb();

    let attendance = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
    let course = await course_db_connect.findOne({ _id: new ObjectID(req.params.id) });

    if (!course || course.teacher[0] !== req.account.email) {
        return res.status(400).send({ message: "Not authorized" });
    }

    const query = { _id: new ObjectID(req.params.id) };

    db_connect.remove(query, 1, function (err, attendance) {
        if (err) {
            return res.status(400).send({ message: err });
        }

        return res.status(200).send({ message: 'Attendance deleted' });
    });
  } else {
    return res.status(401).send({ message: 'Invalid token' });
  }

}
