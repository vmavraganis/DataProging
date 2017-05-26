var fs = require('fs');
const _ = require('lodash');

module.exports.compare = function (obja, objb, identifier) {

  return _.differenceBy(obja, objb, identifier)
}
module.exports.createfile = function (data, outputpath, tempfile, updatefilepath) {
  var exists = fs.exists(outputpath);
  casper.log(exists);
  if (!exists) {
    fs.write(outputpath, JSON.stringify(data, null, '\t'), function (err) {
      if (err) console.log('ERROR: ' + err)
    }, 'w');
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
module.exports.parsebands = function () {
  var table_rows = document.querySelectorAll("tbody tr"); //or better selector
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















