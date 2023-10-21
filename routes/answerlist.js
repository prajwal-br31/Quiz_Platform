var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mydbpwd1!",
    database:"questionnaire",
    dateStrings : 'date'
});
con.connect(function (err) {
    if (err) throw err;

});
var details;
var dept;
var mobile;
var sql;
var Name, Email, Marks, Age, Qualifications, Experience, Job, Salaryp, Salarye, Knc;
var count;
router.get('/admin/answerlist/:dept/:mobile', function (req, res, next) {
    console.log(req.params.mobile);
    dept = req.params.dept;
    mobile = req.params.mobile;


    details = generateAnswerList();
    console.log("jskjdkskjfsklksld");
    console.log(details);
    console.log("jskjdkskjfsklksld");
    setTimeout(function () {
        console.log("jskjdkskjfsklksld");
        if (details.questions.length > 0) {

            res.render('answerlist', {
                mobile: mobile,
                questions: details.questions,
                aAnswer: details.aAnswer,
                cAnswers: details.cAnswers,
                Name: Name,
                Email: Email,
                Marks: Marks,
                Age: Age,
                Qualifications: Qualifications,
                Knc: Knc,
                Job: Job,
                Salaryp: Salaryp,
                Salarye: Salarye,
                Experience: Experience,
                count: count
            });
        }
        else {
            res.render('answerlist', {
                mobile: mobile,
                Name: Name,
                Email: Email,
                Marks: Marks,
                Age: Age,
                Qualifications: Qualifications,
                Knc: Knc,
                Job: Job,
                Salaryp: Salaryp,
                Salarye: Salarye,
                Experience: Experience,
                count: 0
            });
        }
    }, 2000);

});

function generateAnswerList() {

    var questionNos = [];
    var questions = [];
    var cAnswers = [];
    var aAnswer = [];
    var fcAnswers = [];
    sql = "select questions from user ";
    con.query(sql, function (err, result) {
        count = result[0].questions;

        console.log("#############");
        console.log(count);
        console.log("#############");
    });

    sql = "select questionid from " + dept + " where mobile = '" + mobile + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log(result[0].questionid);
        var xa = result[0].questionid;
        console.log(xa);
        if (xa !== null) {

            var questionid = JSON.parse(result[0].questionid);
            var i = 0;
            questionNos = Object.keys(questionid);
            console.log(questionNos);

            for (var x in questionid) {
                aAnswer[i] = questionid[x];
                i++;
            }
            console.log(aAnswer);
        }
    });
    sql = "select name,email,result,age,qualifications,knc,job,salaryp,salarye,experience from " + dept + " where mobile = '" + mobile + "';";
    con.query(sql, function (err, result) {
        if (err) throw err;
        Name = result[0].name;
        Email = result[0].email;
        Marks = result[0].result;
        Age = result[0].age;
        Job = result[0].job;
        Salarye = result[0].salaryp;
        Salaryp = result[0].salarye;
        Experience = result[0].experience;
        Knc = result[0].knc;
        Qualifications = result[0].qualifications;
    });
    setTimeout(function () {
        if (questionNos !== undefined) {

            for (var i = 0; i < questionNos.length; i++) {
                const pos = i;
                con.query("select question,correct,ans1,ans2,ans3,ans4 from " + dept + "_question_list where no = " + questionNos[i] + ";", function (err, result) {
                    if (err) throw err;
                    console.log(result);
                    if (result[0] !== undefined) {
                        questions[pos] = result[0].question;
                        cAnswers[pos] = result[0].correct;
                        switch(cAnswers[pos]){
                            case 1: fcAnswers[pos] = result[0].ans1;
                                    break;
                            case 2: fcAnswers[pos] = result[0].ans2;
                                     break;
                            case 3: fcAnswers[pos] = result[0].ans3;
                                     break;
                            case 4: fcAnswers[pos] = result[0].ans4;
                                     break;
                        }
                        switch(aAnswer[pos]){
                            case '1': aAnswer[pos] = result[0].ans1;
                                    break;
                            case '2': aAnswer[pos] = result[0].ans2;
                                break;
                            case '3': aAnswer[pos] = result[0].ans3;
                                break;
                            case '4': aAnswer[pos] = result[0].ans4;
                                break;
                        }
                        console.log(questions);
                        console.log(cAnswers);
                    }

                });
            }
        }

    }, 300);
    details = {
        questions: questions,
        cAnswers: fcAnswers,
        aAnswer: aAnswer
    };
        console.log(details);
        return details;
}

module.exports = router;



