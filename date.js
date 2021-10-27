const con = require("./db/mysql_connect");

var date = new Date("2011-01-02").getTime() / 1000
//console.log(date)

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd
console.log(today);

var timestamp = Date.parse(today);
if (isNaN(timestamp) == false) {
  var d = new Date(timestamp);
  console.log(d.getDay()+1)
  console.log(d.getMonth()+1)
  console.log(d.getFullYear())
}
else{
    console.log('invalid date');
}


