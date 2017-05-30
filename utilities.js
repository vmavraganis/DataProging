const fs = require('fs');
const config = require('./config');
const _ = require('lodash');
var moment = require('moment');

// returns differences between obja and objb 
// obja~objb difference left
// objb~obja difference new

compare = (obja, objb, identifier) => {
  var difference = {};
  difference.left = _.differenceBy(obja, objb, identifier);
  difference.new = _.differenceBy(objb, obja, identifier);

  return difference;
}

createfile = (data, outputpath, tempfile, updatefilepath) => {
  var exists = fs.exists(outputpath);
  
  if (!exists) {
    fs.write(outputpath, JSON.stringify(data, null, '\t'), function (err) {
      if (err) console.log('ERROR: ' + err)
    }, 'w');
return;  
}
  else if (exists) {
    if (fs.exists(tempfile)) {
      fs.remove('./bands/bandsold.json', function (err) {
        if (err) console.log('ERROR: ' + err);
      });
    }
    fs.move(outputpath, tempfile, function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    fs.write(outputpath, JSON.stringify(data, null, '\t'), function (err) {
      if (err) console.log('ERROR: ' + err)
    }, 'w');
    var oldf = require(tempfile);
    var newf = require(outputpath);
    var different = util.compare(newf, oldf, 'name');
    different.length > 0 ? fs.write(updatefilepath, JSON.stringify(different, null, '\t'), 'w') : ""
  }
}


//parsing bands from the given url.Returns array of data
parsebands = () => {
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
writetofile = (msgname, msg) => {
  var file = `${config.resultsdir}${msgname}.json`
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
GetStringDateFormat=(date)=>{
var check = moment(date, 'YYYY/MM/DD');
var month = check.format('MM');
var day = check.format('DD');
var year = check.format('YYYY');
return day + "" + month + "" + year;
}

module.exports = {
  parsebands,
  compare,
  createfile,
  writetofile,
  GetStringDateFormat
}















