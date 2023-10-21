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
var i=0;
router.get('/admin/addQuestion/:dept', function (req, res) {

    if (req.params.dept) {
        if(i>0){

            var ques = {
                question: req.query.question,
                option1: req.query.option1,
                option2: req.query.option2,
                option3: req.query.option3,
                option4: req.query.option4,
                // img: req.query.pic,
                answer: req.query.answer
            };

            // console.log("------------------------------------------------------");
            // console.log(ques.img);
            // console.log("------------------------------------------------------");
            console.log(ques);
            if (ques.answer !== undefined && ques.question !== undefined && ques.option1 !== undefined && ques.option2 !== undefined && ques.option3 !== undefined && ques.option4 !== undefined) {
                addToDatabase(ques, req.params.dept);
            }
        }

        setTimeout(function () {
            res.render('addQuestion',{
                dept : req.params.dept
            });

        }, 1000);

        i++;
    }

});
var sql ="";
function addToDatabase(ques, department) {
    console.log(department);
    sql = "insert into " + department + "_question_list(question,ans1 , ans2 , ans3 ,ans4 , correct) values ('" + ques.question + "','" + ques.option1 + "','" + ques.option2 + "','" + ques.option3 + "','" + ques.option4 + "','" + parseInt(ques.answer) + "');";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Inserted into" + department);
    });

    sql = "SET @count = 0;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("set count to 0");
    });
    sql = "UPDATE " + department + "_question_list SET " + department + "_question_list.no = @count:= @count + 1;";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("qno are rearranged");
    });

}
module.exports = router;