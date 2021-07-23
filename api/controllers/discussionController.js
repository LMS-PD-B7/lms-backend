'use strict';

var discussionModel = require("../models/discussionModel");
var courseModel = require("../models/courseModel");
const { ObjectID } = require("mongodb");


exports.updateDiscussionList = async function (req, res, discuss) {
    let course_db_connect = courseModel.connectDb();
    let course = await course_db_connect.findOne({_id: new ObjectID(req.params.id)});
    if (course) {
        let query = { _id: new ObjectID(req.params.id) };
        let values = {
            $push: {discussions: new ObjectID(discuss._id)}
        };

        course_db_connect.updateOne(query, values, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            return res.status(200).json({ message: "Discussion list Updated" });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

module.exports = {
    createDiscussion : async function (req, res) {
        let course_db_connect = courseModel.connectDb();
        let course = await course_db_connect.findOne({_id: new ObjectID(req.params.id)});
        let newDiscussion = discussionModel.createNewDiscussion(req.body, req.account, course);
        
        let db_connect = discussionModel.connectDb();
    
        db_connect.insertOne(newDiscussion, function (err, discussion) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return exports.updateDiscussionList(req, res, discussion.ops[0]);
            }
        });
    },

    getAllDiscussion : function(req, res) {
        let db_connect = discussionModel.connectDb();
      
        db_connect.find({}).toArray(function(err, discussion) {
            if (err) {
                return res.status(400).send({
                    message:err
                })
            } else {
                return res.status(200).send(discussion);
            }
        })
    },

    update: function (req, res) {
        if (req.discussion) {
            let db_connect = discussionModel.connectDb();
            let query = { _id: new ObjectID(req.discussion._id) };
            let values = {
                $set: discussionModel.updateDiscussion(req.body)
            };

            db_connect.updateOne(query, values, function (err, discussion) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'Discussion Updated' });
            });
        } else {
            return res.status(401).send({ message: 'Invalid token' });
        }
    }
}