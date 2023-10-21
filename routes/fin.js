var express = require('express');
var router = express.Router();
var HashMap = require('hashmap');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var HashMap = require('hashmap');
var mysql = require('mysql');
var map = new HashMap();
var score;
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mydbpwd1!",
    database:"questionnaire",
    dateStrings : 'date'
});
connection.connect(function (err) {
    if (err) throw err;
});
/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.session.rano === undefined){
        res.redirect('/');
    }else {
        connection.query("insert into " + req.session.dep + " (name,mobile,email,age,qualifications,knc,experience,job,salaryp,salarye) values ('" + req.session.field1 + "','" + req.session.field3 + "','" + req.session.field2 + "','" + req.session.field13 + "','" + req.session.field6 +"\n "+ req.session.field7 +"\n "+req.session.field8+ "','" + req.session.field9 + "\n "+req.session.field15+"','" + req.session.field14 + "','" + req.session.field10 + "','" + req.session.field11 +"','"+ req.session.field12 + "')", function (err, result, fields) {
            if (err) console.log("error encountered");
        });

        if (req.session.que === undefined) {
            var a = '{"0":"0"}';
            connection.query("update " + req.session.dep + " set questionid = '" + a + "' where mobile = '" + req.session.number + "';", function (err) {
                if (err) throw err;
            });
            res.render('fin', {
                score: 0,
                ques:req.session.qlimit,
                name:req.session.name


            });
            req.session.destroy();

        } else {
            function first(callback) {
                
                var corans=req.session.corans;
                req.session.score=corans.size;
                score = req.session.score;
                var abc = JSON.stringify(req.session.que);
                console.log(abc);
                var qu = Object.keys(req.session.que);
                var rn = req.session.rano;
                // console.log(rn);
                // for (var i=0;i<(req.session.qlimit-qu.length);i++){
                //     if(parseInt(qu[i])===rn[i]){
                //
                //     }
                // }
                connection.query("update " + req.session.dep + " set questionid = '" + abc + "' where mobile = '" + req.session.number + "';", function (err) {
                    if (err) throw err;
                });
                connection.query("update " + req.session.dep + " set result = '" + req.session.score + "' where mobile = '" + req.session.number + "';", function (err) {
                    if (err) throw err;
                });
                map = req.session.correctmap;
                console.log(req.session.name);
                res.render('fin', {
                    score: score,
                    ques:req.session.qlimit,
                    name:req.session.name
                });
                callback();
            }

            first(function () {
                req.session.destroy();
            });
        }
    }
});


module.exports = router;
