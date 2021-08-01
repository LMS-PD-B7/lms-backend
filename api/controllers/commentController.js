'use strict';

// const commentModel = require("../models/commentModel");
var commentModel = require("../models/commentModel"),
    accountModel = require("../models/accountModel"),
    discussionModel = require("../models/discussionModel"),
    assignmentModel = require("../models/assignmentModel"),
    { ObjectID } = require('mongodb');;


exports.createComment = async function (req, res) {
    let discussion_db_connect = discussionModel.connectDb();
    let discussion = await discussion_db_connect.findOne({ _id: new ObjectID(req.body.id_post) });

    let assignment_db_connect = assignmentModel.connectDb();
    let assignment = await assignment_db_connect.findOne({ _id: new ObjectID(req.body.id_post) });

    if (discussion || assignment) {
        let newComment = commentModel.createNewComment(req.body, req.account);
        let db_connect = commentModel.connectDb();

        db_connect.insertOne(newComment, function (err, comment) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send({
                    message: "Comment created successfully"

                });
            }
        });
    } else {
        return res.status(400).send({
            message: "Discussion or Assignment not found."
        })
    }
}

exports.getAllComment = function (req, res) {
    let db_connect = commentModel.connectDb();

    db_connect.find({}).toArray(function (err, comment) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return res.status(200).send(comment);
        }
    })
}

exports.deleteComment = async function (req, res) {
    let db_connect = commentModel.connectDb();
    let comment = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

    console.log(req.account.email);
    console.log(comment.maker_email);

    if (req.account) {
        if (req.account.email !== comment.maker_email) {
            return res.status(400).send({ message: "Not authorized" });
        }

        const query = { _id: new ObjectID(req.params.id) };

        db_connect.remove(query, 1, async function (err, comment) {
            if (err) {
                return res.status(400).send({ message: err });
            } else {
                return res.status(200).send({ message: 'Comment deleted' });
            }
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }

}