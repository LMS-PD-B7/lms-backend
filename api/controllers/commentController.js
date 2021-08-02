'use strict';

var commentModel = require("../models/commentModel"),
    accountModel = require("../models/accountModel"),
    discussionModel = require("../models/discussionModel"),
    assignmentModel = require("../models/assignmentModel"),
    { ObjectID } = require('mongodb');;


exports.createComment = async function (req, res) {
    let discussion_db_connect = discussionModel.connectDb();
    let discussion = await discussion_db_connect.findOne({ _id: new ObjectID(req.body.replyTo) });

    let assignment_db_connect = assignmentModel.connectDb();
    let assignment = await assignment_db_connect.findOne({ _id: new ObjectID(req.body.replyTo) });

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

exports.getComment = function (req, res) {
    let db_connect = commentModel.connectDb();
    const query = {
        replyTo: req.params.id_post
    }
    console.log(query);
    db_connect.find(query).toArray(function (err, comment) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            console.log(comment);
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