'use strict';

const commentModel = require("../models/commentModel");
var commentModel = require("../models/commentModel"),
    discussionModel = require("../models/discussionModel"),
    accountModel = require("../models/accountdiscussionModel"),
    { ObjectID } = require('mongodb');;

// exports.updateCommentsDiscussion = function (req, res, comment) {
//     if (req.course) {
//         let acc_db_connect = discussionModel.connectDb();
//         let query = { _id: new ObjectID(req.account._id) };
//         let values = {
//             $push: discussionModel.updateCourseList(req.discussion, course.ops[0], status)
//         };

//         acc_db_connect.updateOne(query, values, {}, function (err, account) {
//             if (err) {
//                 return res.status(400).send({ message: err })
//             }
//             return res.status(200).json({ message: 'User Updated' });
//         });
//     } else {
//         return res.status(401).send({ message: 'Invalid token' });
//     }
// }

// exports.createCommentDiscussion = function (req, res) {
//     let newComment = commentModel.createNewCommentDiscussion(req.body, req.account);
//     let db_connect = commentModel.connectDb();

//     db_connect.insertOne(newComment, function (err, comment) {
//         if (err) {
//             return res.status(400).send({
//                 message: err
//             })
//         } else {
//             return exports.updateCommentsDiscussion(req, res, comment);
//         }
//     });
// }