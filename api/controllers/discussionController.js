'use strict';

var discussionModel = require("../models/discussionModel");

module.exports = {
    createDiscussion : function (req, res) {
        let newDiscussion = discussionModel.createNewDiscussion(req.body);
        
        let db_connect = discussionModel.connectDb();
    
        db_connect.insertOne(newDiscussion, function (err, discussion) {
            if (err) {
                return res.status(400).send({
                    message: err
                })
            } else {
                return res.status(200).send({
                    message: "Discussion created successfully"
                });
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
    }
}

// exports.createDiscussion = function (req, res) {
//     let newDiscussion = discussionModel.createNewDiscussion(req.body);
    
//     let db_connect = discussionModel.connectDb();

//     db_connect.insertOne(newDiscussion, function (err, post) {
//         if (err) {
//             return res.status(400).send({
//                 message: err
//             })
//         } else {
//             return res.status(200).send({
//                 message: "Discussion created successfully"
//             });
//         }
//     });
// }

// exports.getAllDiscussion = function(req, res) {
//     let db_connect = discussionModel.connectDb();
  
//     db_connect.find({}).toArray(function(err, discussion) {
//         if (err) {
//             return res.status(400).send({
//                 message:err
//             })
//         } else {
//             return res.status(200).send(discussion);
//         }
//     })
// }