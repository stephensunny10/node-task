const express = require('express');
var con = require('../db/mysql_connect');
const router = express.Router();

var isConnected  = false;
var query = '';
var daily = 'daily';
var weekly = 'weekly';
var monthly = 'monthly';
con.connect(function(err) { // connect to database first
    if(!err){
        isConnected = true;
    }
});

//=========== get list of all sales=================//
router.get('/list-all', (req, res) => {
    if(isConnected){
        var query = `SELECT * FROM sales`;  // creat query for sql
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            
            res.send(result);
        });
    }
});

//=========== get list of  sales=================//
router.get('/list-sales', (req, res) => {
    var from_date = req.query.from_date;
    var to_date = req.query.to_date;
    var interval = req.query.interval;
    var from_timestamp = Date.parse(from_date); // convert into unix timestamp
    var to_timestamp =  Date.parse(to_date); // convert into unix timestamp

    
    if(from_timestamp != null && to_date !=null){
        query = `SELECT user_name,SUM(amount) AS amount FROM sales  WHERE date BETWEEN '${from_date}' AND '${to_date}' GROUP BY user_name`; // sum query
    }
    else if(interval != null){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        
        to_date = yyyy + '-' + mm + '-' + dd;
        if(interval == daily){  // if seached by daily
            from_date = yyyy + '-' + mm + '-' + dd;
        }
        else if(interval == weekly){ // if seached by weekly
            if(dd < 7){ // check if it is first week 
                dd = '0' + '1';
            }
            else if(dd < 10){
                dd = dd - 7;
                dd = '0' + dd;
            }
            else  {
                dd = dd - 7; // select from last week
            }
        }
        else if(interval == monthly){
            dd = '0' + '1'; // select from whole month since day 1st 
        }

        from_date = yyyy + '-' + mm + '-' + dd;
        var from_timestamp = Date.parse(from_date); // convert into unix timestamp
        var to_timestamp =  Date.parse(to_date); // convert into unix timestamp
        query = `SELECT user_name,SUM(amount) AS amount FROM sales  WHERE date BETWEEN '${from_date}' AND '${to_date}' GROUP BY user_name`; // sum query
        console.log(from_date);
    }

    if(isNaN(from_timestamp) == false && isNaN(to_timestamp) == false){
        if(isConnected){
            //var query = `SELECT * FROM sales WHERE date BETWEEN '${from_date}' AND '${to_date}'`;  // creat query for sql
            //var query = `SELECT * FROM sales WHERE date BETWEEN '2020-10-24' AND '2020-10-26' `;
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                res.send(result);
            });
        }
    }
    else{
        var response = {
            status : false,
            msg : 'date format must be yyyy-mm-yy'
        }
        res.status(400).json(response);
    }
});

//===========add new sales=================//
router.get('/add-sales', (req, res) => {
    var name = req.query.name;
    var amount = req.query.amount;
    var date = req.query.date;

    var timestamp = Date.parse(date);   // date format must be yyyy-mm-dd
     //SELECT * FROM `sales` WHERE date BETWEEN '2020-10-24' AND '2020-10-26' // date query 
    if(isNaN(timestamp) == false){  // check if date is valid or not
        var d = new Date(timestamp);
        if(isConnected){
            var query = `INSERT INTO sales(user_name,amount,date)VALUES('${name}','${amount}','${date}')`;  // creat query for sql
            con.query(query, function (err, result, fields) {
                if (err) throw err;
                console.log(result);
                var response = {
                    status : true,
                    msg : 'record inserted successfully'
                }
                res.status(200).json(response);
            });
        }
    }
    else{
        // invalid date detected
        var response = {
            status : false,
            msg : 'date format must be yyyy-mm-yy'
        }
        res.status(400).json(response);
    }
});

//===========delete sales=================//
router.get('/delete-sales', (req, res) => {
    var id = req.query.id;
    if(isConnected){
        var query = `DELETE  FROM sales WHERE ID = ${id}`;  // creat query for sql
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            var response = {
                status : true,
                msg : 'record deleted successfully'
            }
            res.status(200).json(response);
        });
    }
});


module.exports = router;