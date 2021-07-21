'use strict';

const TEACHER_STATUS = "Teacher";
const STUDENT_STATUS = "Student";

var courseModel = require("../models/courseModel"),
    accountModel = require("../models/accountModel"),
    { ObjectID } = require('mongodb');;

exports.updateCourseListAtAccount = function (req, res, course, status) {
    if (req.account) {
        let acc_db_connect = accountModel.connectDb();
        let query = { _id: new ObjectID(req.account._id) };
        let values = {
            $push: accountModel.updateCourseList(req.account, course.ops[0], status)
        };

        acc_db_connect.updateOne(query, values, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            return res.status(200).json({ message: 'User Updated' });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

exports.addTeacher = async function (req, res) {
    let db_connect = courseModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) })

    if (course) {
        
        let courseQuery = { _id: new ObjectID(req.params.id) };
        let courseValues = {
            $set: {
                teacher: req.body.email
            }
        }
        
        db_connect.updateOne(courseQuery, courseValues, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            let acc_db_connect = accountModel.connectDb();
            let newTeacher = await acc_db_connect.findOne({ email: new ObjectID(req.body.email) })
            let query = { _id: new ObjectID(req.newTeacher._id) };
            let values = {
                // PILIH MAU KIRIM ACCOUNT ATA REQ.ACCOUNT
                $push: accountModel.updateCourseList(newTeacher, course, TEACHER_STATUS)
            };
    
            acc_db_connect.updateOne(query, values, {}, function (err, account) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
            // return res.status(200).json({ message: 'User Updated' });
        });
    } else {
        return res.status(401).json({ message: 'Course not found' });
    }
}

exports.createCourse = function (req, res) {
    let newCourse = courseModel.createNewCourse(req.body, req.account);
    let db_connect = courseModel.connectDb();

    db_connect.insertOne(newCourse, function (err, course) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return exports.updateCourseListAtAccount(req, res, course, TEACHER_STATUS);
        }
    });
}

exports.getAllCourses = function (req, res) {
    let db_connect = courseModel.connectDb();

    db_connect.find({}).toArray(function (err, course) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            return res.status(200).send(course);
        }
    })
}

exports.getCourse = async function (req, res) {
    let db_connect = courseModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) })

    if (course) {
        res.send(course);
    } else {
        return res.status(401).json({ message: 'Course not found' });
    }
}

exports.getStudents = async function (req, res) {
    let db_connect = courseModel.connectDb();
    let acc_db_connect = accountModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

    if (!course) {
        return res.status(401).json({ message: 'Course not found' });
    } else {
        let studentList = [];
        for (const studentEmail of course.student) {
            let student = await acc_db_connect.findOne({ email: studentEmail });

            if (student) {
                studentList.push({
                    display_name: student.display_name,
                    email: student.email
                })
            }
        }
        res.send(studentList);
    }
}

exports.getTeachers = async function (req, res) {
    let db_connect = courseModel.connectDb();
    let acc_db_connect = accountModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

    if (!course) {
        return res.status(401).json({ message: 'Course not found' });
    } else {
        let teacherList = [];
        for (const teacherEmail of course.teacher) {
            let teacher = await acc_db_connect.findOne({ email: teacherEmail });

            if (teacher) {
                teacherList.push({
                    display_name: teacher.display_name,
                    email: teacher.email
                })
            }
        }
        res.send(teacherList);
    }
}

exports.unenrollCourse = function (req, res, member, stat) {
    let acc_db_connect = accountModel.connectDb();

    let query = { email: member.email }
    let values = {
        $pull: {
            courseList: {
                id_course: req.params.id,
                status: stat
            }
        }
    };
    acc_db_connect.updateOne(query, values, {}, function (err, account) {
        if (err) {
            return res.status(400).send({ message: err })
        }
        return res.status(200).json({ message: 'User Updated' });
    });
}

exports.deleteCourse = async function (req, res) {
    if (req.account) {
        let db_connect = courseModel.connectDb();

        let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) });

        if (!course || course.teacher[0] !== req.account.email) {
            return res.status(400).send({ message: "Not authorized" });
        }

        for (const teacher of course.teacher) {
            // exports.unenrollCourse(req, res, teacher, TEACHER_STATUS);
            let teacherQuery = { email: teacher.email }
            let teacherValues = {
                $pull: {
                    courseList: {
                        id_course: req.params.id,
                        status: TEACHER_STATUS
                    }
                }
            };
            acc_db_connect.updateOne(teacherQuery, teacherValues, {}, function (err, account) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
        }

        for (const student of course.student) {
            // exports.unenrollCourse(req, res, student, STUDENT_STATUS);
            let studentQuery = { email: student.email }
            let studentValues = {
                $pull: {
                    courseList: {
                        id_course: req.params.id,
                        status: STUDENT_STATUS
                    }
                }
            };
            acc_db_connect.updateOne(studentQuery, studentValues, {}, function (err, account) {
                if (err) {
                    return res.status(400).send({ message: err })
                }
                return res.status(200).json({ message: 'User Updated' });
            });
        }

        const query = { _id: new ObjectID(req.params.id) };

        db_connect.remove(query, 1, function (err, course) {
            if (err) {
                return res.status(400).send({ message: err });
            }

            return res.status(200).send({ message: 'Course deleted' });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }

}