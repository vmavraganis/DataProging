const fs = require('fs');
const config = require('./config');
const _ = require('lodash');
var moment = require('moment');

// returns differences between obja and objb 
// obja~objb difference leftitems
// objb~obja difference newitems
module.exports.compare = function (oldobj, newobj, identifier) {
  var difference = {};
  difference.leftitems = _.differenceBy(oldobj, newobj, identifier);
  difference.newitems = _.differenceBy(newobj, oldobj, identifier);

  return difference;
}

module.exports.updateBands = function (data, outputpath) {
  var exists = fs.exists(outputpath);
  if (!exists) {
    this.CasperWritetoFile(outputpath, data) ? console.log("file" + outputpath + " created") : console.log("An error occured");
    return;
  }
  else if (exists) {
    var oldf = require(outputpath);
    var different = this.compare(oldf, data, 'link');
    if (different.newitems.length > 0 || different.leftitems.length > 0) {
      console.log("old file length :" + oldf.length);
      console.log("new data length :" + data.length);
      console.log("new items :" + different.newitems.length);
      this.CasperWritetoFile(config.resultsdir + "" + this.GetStringDateFormat(new Date()) + "updates.json", different) ?
        console.log(this.GetStringDateFormat(new Date()) + "updates created") :
        console.log("An error occured");
      this.CasperWritetoFile(outputpath, data) ? console.log("file" + outputpath + "updated") : console.log("An error occured");
      return;

    }
    else { console.log("nothing changed") };
    return;
  }
}

//parsing bands from the given url.Returns array of data
module.exports.parsebands = function () {
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


//parsing records from the given url.Returns array of data
module.exports.parseRecords = function () {
  var categories = document.querySelectorAll("h3+table");
  var studioalbumshtml = categories[0].querySelectorAll("td");
  var livealbumshtml = categories[1].querySelectorAll("td");
  var albums = {};
  albums['studioalbums']=[];
  albums['livealbums']=[];
  
  for (var i = 0; i < studioalbumshtml.length; i++) {
    album = {}
    album['title'] = studioalbumshtml[i].querySelector('strong').innerText;
    album['link'] = studioalbumshtml[i].querySelector('a').href;
    album['year'] = studioalbumshtml[i].querySelector('span:nth-of-type(3)').innerText;
    var rating = studioalbumshtml[i].querySelector('span:nth-of-type(1)').innerText;
    var users = studioalbumshtml[i].querySelector('span:nth-of-type(2)').innerText;
    album['result'] = Math.log(users) * rating
    albums.studioalbums.push(album);
  };

  for (var i = 0; i < livealbumshtml.length; i++) {
    album = {}
    album['title'] = livealbumshtml[i].querySelector('strong').innerText;
    album['link'] = livealbumshtml[i].querySelector('a').href;
    album['year'] = livealbumshtml[i].querySelector('span:nth-of-type(3)').innerText;
     rating = livealbumshtml[i].querySelector('span:nth-of-type(1)').innerText;
     users = livealbumshtml[i].querySelector('span:nth-of-type(2)').innerText;
    album['result'] = Math.log(users) * rating
    albums.livealbums.push(album);
  };


  return albums;
};

//returns any date to DDMMYYYY format
module.exports.GetStringDateFormat = function (date) {
  var check = moment(date, 'YYYY/MM/DD');
  var month = check.format('MM');
  var day = check.format('DD');
  var year = check.format('YYYY');
  return day + "" + month + "" + year;
}

//creates files with filename title and  data using casper fs commands
module.exports.CasperWritetoFile = function (filename, data) {
  try {
    var f = fs.open(filename, 'w');
    f.write(JSON.stringify(data, null, '\t'), filename, "w");
    f.close();
    return true;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

//creates files with filename title and  data using node fs commands
module.exports.NodeWritetoFile = function (filename, data) {
  var file = config.resultsdir + "" + "" + filename + "" + ".json";
  fs.open(file, 'w', function (err, fd) {
    if (err) { console.log(err) }
    fs.write(fd, JSON.stringify(data, null, '\t'), 'w', function (error, fd) {
      if (error) {
        console.log(error);
      }
    });

  });
}













