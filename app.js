const express = require('express');
var route = require('./router/route');
var con = require('./db/mysql_connect');
var app = express();
app.use('/api/',route);


var port  = process.env.PORT || 8080;
app.listen(port,function(){
    console.log('server started at ' + port);
})


//===============*INSTRUCTION*==========================//
// code setup --------------------------
/*

1. create my sql database name -'task'
2. run sql code sales.sql to create table 
3. setup database configuration in 'mysql-connect.js'
4. run project by command 'npm start'
5. start using api given below

*/

//=========================Api list example====================//
/*
* Add new sales-
http://127.0.0.1:8080/api/add-sales?name=michael&amount=1000&date=2021-10-08

* List sales- by date filter 
http://127.0.0.1:8080/api/list-sales?from_date=2020-10-24&to_date=2020-10-26

* List sales by interval (daily, weekly , monthly) must pass in lower case
http://127.0.0.1:8080/api/list-sales?interval=daily
http://127.0.0.1:8080/api/list-sales?interval=weekly
http://127.0.0.1:8080/api/list-sales?interval=monthly

* st all sales available in database
http://127.0.0.1:8080/api/list-all

* Delete sales by id
http://127.0.0.1:8080/api/delete-sales?id=5

*/