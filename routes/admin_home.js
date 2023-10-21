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
var dept;
var count;
var dep = [];
var attendeeCount;
con.connect(function (err) {
    if (err) throw err;

    con.query("select count(*) as count from dep", function (err, result2) {
        if (err) throw err;
        console.log("...............");
        console.log(result2);

        console.log(JSON.stringify(result2));
        var x = JSON.stringify(result2);
        console.log(x);
        var y = JSON.parse(x);
        console.log(y);
        console.log(typeof y);
        console.log("...............");

        count = result2[0].count;
    });
    con.query("select * from dep", function (err, result1) {
        if (err) throw err;
        console.log(result1);


        for (var i = 0; i < count; i++) {
            dep[i] = result1[i].depname;
            console.log(dep[i]);
        }
        console.log(JSON.stringify(result1));
        console.log(dep);
        dept = JSON.stringify(result1);
        console.log(dept);
        console.log(typeof dept);


    });
});
var i = 0;
var details;
var searchDetails ;
var searchCount ;
/*var dates= [];
var dateCount1= 0;
var dateCount= 0;*/
var searchName = undefined;
var searchattempt ;

router.get('/admin/:dept', function (req, res, next) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.session.a===1) {
        console.log(req.params.dept);
        if (req.params.dept) {
            if (i > 0) {
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

            var atd = req.query.attendee;
            console.log(10101010101010101010101010110);
            console.log(atd);
            console.log(10101010101010101010101010110);
            if(atd !== undefined)
            {
                console.log(atd);
                if (typeof atd === "string") {
                    var attendeestodelete = [];
                    attendeestodelete.push(atd);
                    console.log(attendeestodelete);
                    deleteAttendee(attendeestodelete, req.params.dept);
                }
                else {
                    console.log(atd);
                    deleteAttendee(atd, req.params.dept);
                }
            }

            searchDetails = {};
            searchCount = 0;
            searchattempt =0;
            console.log("start");
            details = attendeeDetails(req, req.params.dept);
            console.log("end");
            searchName = req.query.search;
            console.log(searchName);



            console.log("44444444444444444444444444");
            console.log(searchDetails);
            console.log("44444444444444444444444444");

            if (searchName !== undefined) {
                searchFromDatabase(searchName, req.params.dept);
                searchattempt=1;
            }
            //generateDates(req.params.dept);
            console.log("5555555555555555555555555");
            console.log(searchDetails);
            console.log("5555555555555555555555555");



            setTimeout(function () {
                //dateCount1 = dates.length;
                renderpage(req, res);

            }, 1000);

            i++;
        }
        else
            res.redirect('/newpage');
    }
    else{
        res.render('admin.ejs');
    }
});
router.post('/admin/:dept', function (req, res) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    if(req.session.a===1) {
        console.log("enter");
        var qtd = req.body.question;
        if (qtd !== undefined) {
            if (typeof qtd === "string") {
                var questionstodelete = [];
                questionstodelete.push(qtd);
                console.log(questionstodelete);
                deleteQuestion(questionstodelete, req.params.dept);
            }
            else {
                console.log(qtd);
                deleteQuestion(qtd, req.params.dept);
            }
        }
        var aDate, aName, aMobile, aEmail, aQuesAns, aRes,aAge,aQ,aE,aKnc,aJob,aSalaryp,aSalarye;
        aDate = details.aDate;
        aName = details.aName;
        aMobile = details.aMobile;
        aEmail = details.aEmail;
        aQuesAns = details.aQuesAns;
        aRes = details.aRes;
        aAge=details.aAge;
        aQ=details.aQ;
        aE=details.aE;
        aKnc=details.aKnc;
        aJob=details.aJob;
        aSalaryp=details.aSalaryp;
        aSalarye=details.aSalarye;
        console.log("-----------------------------"+req.params.dept);

        //generateDates(req.params.dept);
        setTimeout(function () {
            //dateCount1 = dates.length;
            res.render('admin_home', {
                dept: req.params.dept,
                aDate: aDate,
                aName: aName,
                aMobile: aMobile,
                aEmail: aEmail,
                aRes: aRes,
                aAge: aAge,
                aQ : aQ,
                aE : aE,
                aKnc: aKnc,
                aJob: aJob,
                aSalaryp:aSalaryp,
                aSalarye:aSalarye,
                attendeeCount: attendeeCount,
                searchCount: searchCount,
                searchAttempt : searchattempt,
                dep:req.params.dept
            

                /*dates : dates,
                dateCount : dateCount1*/
            });
        },500);

        console.log("exit");
    }
    else{
        res.render('admin.ejs');
    }
});

function renderpage(req,res) {
    var aDate, aName, aMobile, aEmail, aQuesAns, aRes,aAge,aQ,aE,aKnc,aJob,aSalary;
    aDate = details.aDate;
    aName = details.aName;
    aMobile = details.aMobile;
    aEmail = details.aEmail;
    aQuesAns = details.aQuesAns;
    aRes = details.aRes;
    aAge=details.aAge;
    aQ=details.aQ;
    aE=details.aE;
    aKnc=details.aKnc;
    aJob=details.aJob;
    aSalaryp=details.aSalaryp;
    aSalarye=details.aSalarye;

    console.log(details);
    console.log(aDate);
    console.log(aName);
    console.log(aMobile);
    console.log(aEmail);
    console.log(aQuesAns);
    console.log(aRes);

    if (searchDetails !== undefined && searchattempt === 1) {
        var sDate, sName, sMobile, sEmail, sQuesAns, sRes,sAge,sQ,sE,sKnc,sJob,sSalaryp,sSalarye;
        sDate = searchDetails.sDate;
        sName = searchDetails.sName;
        sMobile = searchDetails.sMobile;
        sEmail = searchDetails.sEmail;
        sQuesAns = searchDetails.sQuesAns;
        sRes = searchDetails.sRes;
        sAge = searchDetails.sAge;
        sQ = searchDetails.sQ;
        sE = searchDetails.sE;
        sKnc = searchDetails.sKnc;
        sJob = searchDetails.sJob;
        sSalaryp = searchDetails.sSalaryp;
        sSalarye = searchDetails.sSalarye;

        console.log(searchDetails);
        console.log(sDate);
        console.log(sName);
        console.log(sMobile);
        console.log(sEmail);
        console.log(sQuesAns);
        console.log(sRes);
        console.log("*************");
        console.log(searchCount);
        console.log("*************");
        res.render('admin_home', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ : aQ,
            aE : aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp:aSalaryp,
            aSalarye:aSalarye,


            sDate: sDate,
            sName: sName,
            sMobile: sMobile,
            sEmail: sEmail,
            sRes: sRes,
            sAge: sAge,
            sQ : sQ,
            sE : sE,
            sKnc: sKnc,
            sJob: sJob,
            sSalaryp:sSalaryp,
            sSalarye:sSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt : searchattempt,
            dep:req.params.dept

            /* dates : dates,
             dateCount : dateCount1*/

           /* dates : dates,
            dateCount : dateCount1*/
        });
    }
    else if(searchDetails === undefined && searchattempt === 1){
        res.render('admin_home', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ : aQ,
            aE : aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp:aSalaryp,
            aSalarye:aSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt : searchattempt,
            dep:req.params.dept

            /* dates : dates,
             dateCount : dateCount1*/
        });
    }
    else{
        res.render('admin_home', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ : aQ,
            aE : aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp:aSalaryp,
            aSalarye:aSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt : searchattempt,
            dep:req.params.dept

            /* dates : dates,
             dateCount : dateCount1*/
           /* dates : dates,
            dateCount : dateCount1*/
        });
    }

}
var sql = "";

/*
function generateDates(department) {
    sql = "select count(*) as count from " + department+";";
    con.query(sql,function (err,result) {
        if(err) throw err;
        dateCount = result[0].count;
    });

    sql = "select date from " + department + ";";
    con.query(sql,function (err,result) {
        if(err) console.log("error encountered");
        console.log(result);


        for(var ij = 0 ; ij<dateCount;ij++){
            var date = result[ij].date;
            console.log(date);
            con.query("select date('"+ date+"') as date;",function (err,result) {
                if(err) throw err;
                console.log(result);
                var compare  =  result[0].date;
                console.log("compare is "+ compare);
                console.log(dates.length);
                var compareflag =0 ;
                for(var k=0 ; k<dates.length ; k++){
                    if(dates[k] === compare)
                    {
                        compareflag =1;
                        console.log("K is " +k);
                        console.log("Same as " +dates[k]);
                    }

                }
                if(compareflag === 0){
                    dates[dates.length] =compare;
                    console.log("date is "+ dates[dates.length]);
                }

            });

        }


        setTimeout(function () {
            console.log(dates);
        },300);

    });
}
*/

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
function deleteQuestion(questionstodelete, department) {
    console.log(questionstodelete.length);
    for (var i = 0; i < questionstodelete.length; i++) {
        sql = "delete from " + department + "_question_list where question = '" + questionstodelete[i] + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted Questions from " + department);
        });
    }
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
function deleteAttendee(attendeestodelete, department) {
    console.log(attendeestodelete.length);
    for (var i = 0; i < attendeestodelete.length; i++) {
        sql = "delete from " + department + " where mobile = '"+attendeestodelete[i]+"';";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted Attendees from " + department);
        });
    }

}
function attendeeDetails(req,department) {

    /* var attend  = req.body.attendee;
     if(attend !== undefined)
     {
     if (typeof attend === "string") {
     var attendeestodelete = [];
     attendeestodelete.push(attend);
     console.log(attendeestodelete);
     deleteAttendee(attendeestodelete, department);
     }
     else {
     console.log(attend);
     deleteAttendee(attend, department);
     }
     }
     */
    var aDate = [], aName = [], aMobile = [], aEmail = [], aQuesAns = [], aRes = [], aAge=[], aQ=[], aE=[], aKnc=[], aJob=[], aSalaryp=[], aSalarye=[];
    sql = "select count(*) as count from " + department;
    con.query(sql, function (err, result) {
        if (err) throw err;

        attendeeCount = result[0].count;
        console.log(attendeeCount);
    });

    sql = "select * from " + department;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Attendee Details");
        console.log(result);
        for (var i = attendeeCount - 1, j = 0; i >= 0; i--, j++) {
            var sli =  result[i].date;

            aDate[j] = sli.toString().slice(0,25);
            aName[j] = result[i].name;
            aMobile[j] = result[i].mobile;
            aEmail[j] = result[i].email;
            aQuesAns[j] = result[i].questionid;
            aRes[j] = result[i].result;
            aAge[j]= result[i].age;
            aQ[j]= result[i].qualifications;
            aE[j]= result[i].experience;
            aKnc[j]= result[i].knc;
            aJob[j]= result[i].job;
            aSalaryp[j]= result[i].salaryp;
            aSalarye[j]= result[i].salarye;

        }
        details = {
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aQuesAns: aQuesAns,
            aRes: aRes,
            aAge: aAge,
            aQ : aQ,
            aE : aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp:aSalaryp,
            aSalarye:aSalarye
        };

    });
    setTimeout(function () {
        return details;
    }, 200);

}
function searchFromDatabase(searchName, department) {
    var sDate = [], sName = [], sMobile = [], sEmail = [], sQuesAns = [], sRes = [], sAge=[], sQ=[], sE=[], sKnc=[], sJob=[], sSalaryp=[],sSalarye=[];

    var flag =0;


    var j=0;
    console.log("9999999999999999999999999");
    console.log(searchName);
    console.log("9999999999999999999999999");
    function show (callback) {
        sql = "select count(*) as count from " + department + " where mobile = '" + searchName + "';";
        con.query(sql, function (err, result) {
            if (err) throw err;

            searchCount = result[0].count;
        });
        sql = "select * from " + department + " where mobile = '" + searchName + "';";
        con.query(sql, function (err, result) {
            if (err) throw err;

            else
            {
                console.log("0000000000000000000000000000000000");
                console.log(result);
                console.log("0000000000000000000000000000000000");
                if(result.length >0){

                    flag =1;
                    for (var i = searchCount - 1, j = 0; i >= 0; i--, j++) {
                        sDate[j] = result[i].date;
                        sName[j] = result[i].name;
                        sMobile[j] = result[i].mobile;
                        sEmail[j] = result[i].email;
                        sQuesAns[j] = result[i].questionid;
                        sRes[j] = result[i].result;
                        sAge[j]= result[i].age;
                        sQ[j]= result[i].qualifications;
                        sE[j]= result[i].experience;
                        sKnc[j]= result[i].knc;
                        sJob[j]= result[i].job;
                        sSalaryp[j]= result[i].salaryp;
                        sSalarye[j]= result[i].salarye;
                    }

                    searchDetails = {
                        sDate: sDate,
                        sName: sName,
                        sMobile: sMobile,
                        sEmail: sEmail,
                        sQuesAns: sQuesAns,
                        sAge: sAge,
                        sQ : sQ,
                        sE : sE,
                        sKnc: sKnc,
                        sJob: sJob,
                        sSalaryp:sSalaryp,
                        sSalarye:sSalarye,
                        sRes: sRes
                    };
                }
            }

            callback();
        });
    }

    show(function () {

        if(flag === 0)
        {

            sql = "select count(*) as count from " + department + " where name LIKE '%" + searchName + "%';";
            con.query(sql, function (err, result) {
                if (err) throw err;

                searchCount = result[0].count;
            });
            sql = "select * from " + department + " where name LIKE '%" + searchName + "%';";
            con.query(sql, function (err, result) {
                if (err) throw err;

                for (var i = searchCount - 1, j = 0; i >= 0; i--, j++) {
                    sDate[j] = result[i].date;
                    sName[j] = result[i].name;
                    sMobile[j] = result[i].mobile;
                    sEmail[j] = result[i].email;
                    sQuesAns[j] = result[i].questionid;
                    sRes[j] = result[i].result;
                    sAge[j]= result[i].age;
                    sQ[j]= result[i].qualifications;
                    sE[j]= result[i].experience;
                    sKnc[j]= result[i].knc;
                    sJob[j]= result[i].job;
                    sSalaryp[j]= result[i].salaryp;
                    sSalarye[j]= result[i].salarye;
                }
                searchDetails = {
                    sDate: sDate,
                    sName: sName,
                    sMobile: sMobile,
                    sEmail: sEmail,
                    sQuesAns: sQuesAns,
                    sRes: sRes,
                    sAge: sAge,
                    sQ : sQ,
                    sE : sE,
                    sKnc: sKnc,
                    sJob: sJob,
                    sSalaryp:sSalaryp,
                    sSalarye:sSalarye
                };
                console.log(searchDetails);
            });
        }
    });

    setTimeout(function () {
        console.log(searchDetails);
        return searchDetails;
    }, 200);
}

/*var z =[];
 function searchQuestion(searchques, department) {
 console.log("entered");
 if (department === 'nursingDepartment') {
 sql = "select question from nursing_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);
 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }
 });
 }
 else if (department === 'accountsDepartment') {
 sql = "select question from accounts_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);
 var z = [];
 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }
 });
 }
 else if (department === 'promotionDepartment') {
 sql = "select question from promotion_question_list where question LIKE '%" + searchques + "%';";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log(result);
 var z = [];
 for (var i = 0; i < result.length; i++) {
 z.push(result[i].question);
 }
 });
 }
 return z;
 }*/

module.exports = router;
