var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var app = require('express');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mydbpwd1!",
    database:"questionnaire",
    dateStrings : 'date'
});
var count;
var depp = [];
router.post('/report',function (req , res) {
    if(req.session.a===1) {
        function first(callback) {
            con.query("select count(*) as count from dep", function (err, result2) {
                if (err) throw err;
                console.log(result2);

                console.log(JSON.stringify(result2));
                var x = JSON.stringify(result2);
                console.log(x);
                var y = JSON.parse(x);
                console.log(y);
                console.log(typeof y);

                count = result2[0].count;
            });
            con.query("select * from dep", function (err, result1) {
                if (err) throw err;
                console.log(result1);


                for (var i = 0; i < count; i++) {
                    console.log(result1[i].depname);
                    depp[i] = result1[i].depname;
                    console.log(depp[i]);
                }
                console.log(JSON.stringify(result1));
                console.log(depp);

                callback();

            });

        }

        first(function () {

            res.render('report.ejs', {
                count: count,
                dep: depp
            });

        });
    }
    else
        res.render('admin.ejs');
});

module.exports = router;
