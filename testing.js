 var band = require('./test.json');
 _und = require("./underscore.js");
 var fs = require('fs');



var writetofile=function(msgname,msg){
  var file=`./bands/${msgname}.json`
  console.log(file);
fs.open(file, 'w', function(err, fd) {
  fs.write(fd, JSON.stringify(msg, null, '\t'), 'w');
  fs.close(fd);
});}

var users=
_und
.chain(band)
.pluck('users')
.reduce(function(memo,num){console.log("memo: "+memo+" num :"+num);return parseInt(memo)+parseInt(num)},0)
.value();

console.log(users);

//var sum = _.reduce([1, 2, 3], function(memo, num){ return memo + num; }, 0);
