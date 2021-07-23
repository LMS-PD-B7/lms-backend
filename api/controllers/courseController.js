'use strict';

const TEACHER_STATUS = "Teacher";
const STUDENT_STATUS = "Student";

var courseModel = require("../models/courseModel"),
    accountModel = require("../models/accountModel"),
    { ObjectID } = require('mongodb');;

exports.updateCourseListAtAccount = function (account, res, course, status) {
    if (account) {
        let acc_db_connect = accountModel.connectDb();
        let query = { _id: new ObjectID(account._id) };
        let values = {
            $push: accountModel.updateCourseList(account, course, status)
        };

        acc_db_connect.updateOne(query, values, {}, function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            return res.status(200).json({ message: "User's course list Updated" });
        });
    } else {
        return res.status(401).send({ message: 'Invalid token' });
    }
}

exports.addStudent = async function (req, res) {
    let db_connect = courseModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) })

    if (course) {
        let courseQuery = { _id: new ObjectID(req.params.id) };
        let courseValues = {
            $push: {
                student: req.body.email
            }
        }

        db_connect.updateOne(courseQuery, courseValues, {}, async function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            let acc_db_connect = accountModel.connectDb();

            let newStudent = await acc_db_connect.findOne({ email: req.body.email })
            if (!newStudent) {
                return res.status(200).json({ message: 'User not found' });
            } else {
                return exports.updateCourseListAtAccount(newStudent, res, course, STUDENT_STATUS);
            }
        });
    } else {
        return res.status(401).json({ message: 'Course not found' });
    }
}


exports.addTeacher = async function (req, res) {
    let db_connect = courseModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) })

    if (course) {
        let courseQuery = { _id: new ObjectID(req.params.id) };
        let courseValues = {
            $push: {
                teacher: req.body.email
            }
        }

        db_connect.updateOne(courseQuery, courseValues, {}, async function (err, account) {
            if (err) {
                return res.status(400).send({ message: err })
            }
            let acc_db_connect = accountModel.connectDb();

            let newTeacher = await acc_db_connect.findOne({ email: req.body.email })
            if (!newTeacher) {
                return res.status(200).json({ message: 'User not found' });
            } else {
                return exports.updateCourseListAtAccount(newTeacher, res, course, TEACHER_STATUS);
            }
        });
    } else {
        return res.status(401).json({ message: 'Course not found' });
    }
}

exports.enroll = async function (req, res) {
    let db_connect = courseModel.connectDb();

    let course = await db_connect.findOne({ _id: new ObjectID(req.params.id) })

    if (course) {
        if (course.enrollment_key === req.body.enrollment_key) {
            return exports.addStudent(req, res);
        } else {
            return res.status(401).json({ message: 'Enrollment key invalid' });
        }
    } else {
        return res.status(401).json({ message: 'Course not found' });
    }

}

exports.createCourse = function (req, res) {
    let newCourse = courseModel.createNewCourse(req.body, req.account);
    let db_connect = courseModel.connectDb();

    db_connect.insertOne(newCourse, async function (err, course) {
        if (err) {
            return res.status(400).send({
                message: err
            })
        } else {
            let acc_db_connect = accountModel.connectDb();
            let teacher = await acc_db_connect.findOne({ _id: new ObjectID(req.account._id) })

            console.log(req.account);
            console.log(teacher);
            console.log(course.ops[0]);
            return exports.updateCourseListAtAccount(teacher, res, course.ops[0], TEACHER_STATUS);
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

exports.unenroll = function (account, course, stat) {
    let course_db_connect = courseModel.connectDb();
    let acc_db_connect = accountModel.connectDb();

    let course_query = { _id: new ObjectID(account._id) }
    let course_values = {
        $pull: {
            courseList: {
                id_course: account._id,
                status: stat
            }
        }
    };
    let acc_query = { _id: new ObjectID(account._id) }
    let acc_values = {
        $pull: {
            courseList: {
                id_course: account._id,
                status: stat
            }
        }
    };
    acc_db_connect.updateOne(acc_query, acc_values, {}, function (err, account) {
        if (err) {
            return res.status(400).send({ message: err })
        }
        course_db_connect.updateOne(course_query, course_values, {}, function (err, course) {
            
        })
        return res.status(200).json({ message: 'User Updated' });
    });
}

exports.unenrollCourse = async function (req, res) {
    let acc_db_connect = accountModel.connectDb();

    let query = { email: req.account.email }
    let values = {
        $pull: {
            course_list: {
                id_course: new ObjectID(req.params.id),
                status: STUDENT_STATUS
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