'use strict';

const attendanceModel = require("../models/attendanceModel");
const courseModel = require("../models/courseModel");
const accountModel = require("../models/accountModel");

exports.createAttendance = function (req, res) {
  if (req.account) {
    let db_connect = attendanceModel.connectDb();
    let newAttendance = attendanceModel.createNewAttendance(req.body, req.account, req.course);

    db_connect.insertOne(newAttendance, function (err, attendance) {
      if (err) {
        return res.status(400).send({
          message: err
        })
      }

      return res.status(200).send({
        message: "Attendance created successfully"
      });
    })
  } else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

exports.getAttendanceByMakerMail = async function(req, res) {
  let db_connect = attendanceModel.connectDb();

  db_connect.find({ maker_email: new ObjectID(req.params.maker_email) }).toArray(async function(err, attendance) {
    if (err) {
      return res.status(400).send({
        message: err
      })
    }

    attendance = await Promise.all(attendance.map(async (attendance) => {
      const account_db_connect = accountModel.connectDb();
      const maker_email = await account_db_connect.findOne({ _id: new ObjectID(attendance.maker_email) });

      attendance.maker_email = {
        email: maker_email.email,
        _id: maker_email._id,
      };

      if (req.account) {
        attendance.account = accountModel //
      }

      return attendance;
    }));

    return res.status(200).send(comments);
  })
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

  exports.delete = async function (req, res){
    if (req.account){
      let db_connect = attendanceModel.connectDb();
  
      let attendance = await db_connect.findOne({ _id: new ObjectID(req.params.id) });
      let account = toString(req.account._id)
      let attendanceaccount = toString(attendance.maker_email)
      if ( account !== attendanceaccount && !req.account.is_moderator) {
        return res.status(400).send({ message: "Not authorized" });
      }
  
      const query = { _id: new ObjectID(req.params.id) };
      db_connect.deleteOne(query,function (err, response){
        if (err) {
          return res.status(400).send({ message: err });
        }
  
        return res.status(200).send({ message: 'Attendance Deleted' })
      });
    } else {
      return res.status(401).send({ message: 'Invalid token' });
    }
  }
  