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
var searchDetails;
var searchCount;

var searchName = undefined;
var searchattempt;
var attendeeCount;

router.get('/admin/attendeeList/:dept', function (req, res) {
    var atd = req.query.attendee;
    console.log(10101010101010101010101010110);
    console.log(atd);
    console.log(10101010101010101010101010110);
    if (atd !== undefined) {
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
    searchattempt = 0;
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
        searchattempt = 1;
    }
    setTimeout(function () {
        //dateCount1 = dates.length;
        renderpage(req, res);

    }, 1000);
});

function renderpage(req, res) {
    var aDate, aName, aMobile, aEmail, aQuesAns, aRes, aAge, aQ, aE, aKnc, aJob, aSalary;
    aDate = details.aDate;
    aName = details.aName;
    aMobile = details.aMobile;
    aEmail = details.aEmail;
    aQuesAns = details.aQuesAns;
    aRes = details.aRes;
    aAge = details.aAge;
    aQ = details.aQ;
    aE = details.aE;
    aKnc = details.aKnc;
    aJob = details.aJob;
    aSalaryp = details.aSalaryp;
    aSalarye = details.aSalarye;

    console.log(details);
    console.log(aDate);
    console.log(aName);
    console.log(aMobile);
    console.log(aEmail);
    console.log(aQuesAns);
    console.log(aRes);

    if (searchDetails !== undefined && searchattempt === 1) {
        var sDate, sName, sMobile, sEmail, sQuesAns, sRes, sAge, sQ, sE, sKnc, sJob, sSalaryp, sSalarye;
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
        res.render('attendee', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ: aQ,
            aE: aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp: aSalaryp,
            aSalarye: aSalarye,


            sDate: sDate,
            sName: sName,
            sMobile: sMobile,
            sEmail: sEmail,
            sRes: sRes,
            sAge: sAge,
            sQ: sQ,
            sE: sE,
            sKnc: sKnc,
            sJob: sJob,
            sSalaryp: sSalaryp,
            sSalarye: sSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt: searchattempt
            /* dates : dates,
             dateCount : dateCount1*/
        });
    }
    else if (searchDetails === undefined && searchattempt === 1) {
        res.render('attendee', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ: aQ,
            aE: aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp: aSalaryp,
            aSalarye: aSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt: searchattempt

        });
    }
    else {
        res.render('attendee', {
            dept: req.params.dept,
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aRes: aRes,
            aAge: aAge,
            aQ: aQ,
            aE: aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp: aSalaryp,
            aSalarye: aSalarye,
            attendeeCount: attendeeCount,
            searchCount: searchCount,
            searchAttempt: searchattempt

        });
    }

}

var sql = "";

function deleteAttendee(attendeestodelete, department) {
    console.log(attendeestodelete.length);
    for (var i = 0; i < attendeestodelete.length; i++) {
        sql = "delete from " + department + " where mobile = '" + attendeestodelete[i] + "';";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Deleted Attendees from " + department);
        });
    }

}

function attendeeDetails(req, department) {


    var aDate = [], aName = [], aMobile = [], aEmail = [], aQuesAns = [], aRes = [], aAge = [], aQ = [], aE = [],
        aKnc = [], aJob = [], aSalaryp = [], aSalarye = [];
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
            var sli = result[i].date;

            aDate[j] = sli.toString().slice(0, 25);
            aName[j] = result[i].name;
            aMobile[j] = result[i].mobile;
            aEmail[j] = result[i].email;
            aQuesAns[j] = result[i].questionid;
            aRes[j] = result[i].result;
            aAge[j] = result[i].age;
            aQ[j] = result[i].qualifications;
            aE[j] = result[i].experience;
            aKnc[j] = result[i].knc;
            aJob[j] = result[i].job;
            aSalaryp[j] = result[i].salaryp;
            aSalarye[j] = result[i].salarye;

        }
        details = {
            aDate: aDate,
            aName: aName,
            aMobile: aMobile,
            aEmail: aEmail,
            aQuesAns: aQuesAns,
            aRes: aRes,
            aAge: aAge,
            aQ: aQ,
            aE: aE,
            aKnc: aKnc,
            aJob: aJob,
            aSalaryp: aSalaryp,
            aSalarye: aSalarye
        };

    });
    setTimeout(function () {
        return details;
    }, 200);

}

function searchFromDatabase(searchName, department) {
    var sDate = [], sName = [], sMobile = [], sEmail = [], sQuesAns = [], sRes = [], sAge = [], sQ = [], sE = [],
        sKnc = [], sJob = [], sSalaryp = [], sSalarye = [];

    var flag = 0;


    var j = 0;
    console.log("9999999999999999999999999");
    console.log(searchName);
    console.log("9999999999999999999999999");

    function show(callback) {
        sql = "select count(*) as count from " + department + " where mobile = '" + searchName + "';";
        con.query(sql, function (err, result) {
            if (err) throw err;

            searchCount = result[0].count;
        });
        sql = "select * from " + department + " where mobile = '" + searchName + "';";
        con.query(sql, function (err, result) {
            if (err) throw err;

            else {
                console.log("0000000000000000000000000000000000");
                console.log(result);
                console.log("0000000000000000000000000000000000");
                if (result.length > 0) {

                    flag = 1;
                    for (var i = searchCount - 1, j = 0; i >= 0; i--, j++) {
                        sDate[j] = result[i].date;
                        sName[j] = result[i].name;
                        sMobile[j] = result[i].mobile;
                        sEmail[j] = result[i].email;
                        sQuesAns[j] = result[i].questionid;
                        sRes[j] = result[i].result;
                        sAge[j] = result[i].age;
                        sQ[j] = result[i].qualifications;
                        sE[j] = result[i].experience;
                        sKnc[j] = result[i].knc;
                        sJob[j] = result[i].job;
                        sSalaryp[j] = result[i].salaryp;
                        sSalarye[j] = result[i].salarye;
                    }

                    searchDetails = {
                        sDate: sDate,
                        sName: sName,
                        sMobile: sMobile,
                        sEmail: sEmail,
                        sQuesAns: sQuesAns,
                        sAge: sAge,
                        sQ: sQ,
                        sE: sE,
                        sKnc: sKnc,
                        sJob: sJob,
                        sSalaryp: sSalaryp,
                        sSalarye: sSalarye,
                        sRes: sRes
                    };
                }
            }

            callback();
        });
    }

    show(function () {

        if (flag === 0) {

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
                    sAge[j] = result[i].age;
                    sQ[j] = result[i].qualifications;
                    sE[j] = result[i].experience;
                    sKnc[j] = result[i].knc;
                    sJob[j] = result[i].job;
                    sSalaryp[j] = result[i].salaryp;
                    sSalarye[j] = result[i].salarye;
                }
                searchDetails = {
                    sDate: sDate,
                    sName: sName,
                    sMobile: sMobile,
                    sEmail: sEmail,
                    sQuesAns: sQuesAns,
                    sRes: sRes,
                    sAge: sAge,
                    sQ: sQ,
                    sE: sE,
                    sKnc: sKnc,
                    sJob: sJob,
                    sSalaryp: sSalaryp,
                    sSalarye: sSalarye
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

module.exports = router;
