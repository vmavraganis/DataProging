const fs = require('fs');
const config = require('./config');
const _ = require('lodash');
var moment = require('moment');

// returns differences between obja and objb 
// obja~objb difference left
// objb~obja difference new

module.exports.compare = function(oldobj, newobj, identifier)  {
  var difference = {};
  difference.left = _.differenceBy(oldobj, newobj, identifier);
  difference.new = _.differenceBy(newobj, oldobj, identifier);

  return difference;
}

module.exports.createfile = function(data, outputpath)  {
  var exists = fs.exists(outputpath);
  if (!exists) {
   writetofile("bands",data);
return;  
}
  else if (exists) {   
    var oldf = require(outputpath);
    var different = compare(oldf,data, 'name');
    different.length > 0 ? writetofile(GetStringDateFormat(new Date())+"updates",different) : ""
    writetofile("bands",data);
  }
}


//parsing bands from the given url.Returns array of data
module.exports.parsebands =  function()  {
  var table_rows = document.querySelectorAll("tbody tr");
  var artists = [];
  for (var i = 1; i < table_rows.length; i++) {
    columns = table_rows[i].querySelectorAll('td');
    artists.push({
      'name': columns[0].innerText,
      'genre': columns[1].innerText,
      'country': columns[2].innerText,
      'link': columns[0].childElements(0)[0].href
    });
  }
  return artists;
}

//creates files with msgname title and msg data
module.exports.writetofile = function(msgname, msg){
  var file = config.resultsdir+""+""+msgname+""+"json";
  console.log(file);
  fs.open(file, 'w', function (err, fd) {
    if (err) { console.log(err) }
    fs.write(fd, JSON.stringify(msg, null, '\t'), 'w', function (error, fd) {
      if (error) {
        console.log(error);
      }
    });

  });
}
//returns any date to DDMMYYYY format
module.exports.GetStringDateFormat= function(date){
var check = moment(date, 'YYYY/MM/DD');
var month = check.format('MM');
var day = check.format('DD');
var year = check.format('YYYY');
return day + "" + month + "" + year;
}















