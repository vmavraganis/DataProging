const fs = require('fs');
const config = require('./config');
const _ = require('lodash');
const moment = require('moment');
const util = require('util');


// returns differences between obja and objb 
// obja~objb difference leftitems
// objb~obja difference newitems
module.exports.compare = function (oldobj, newobj, identifier) {
  var difference = {};
  difference.leftitems = _.differenceBy(oldobj, newobj, identifier);
  difference.newitems = _.differenceBy(newobj, oldobj, identifier);

  return difference;
}
module.exports.fileExists = (path) =>{
  return fs.existsSync(path)
}

module.exports.readFile = (filename)=>{
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
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
module.exports.getDailyupdates = function () {
  const tobeparseddata = require('./bands/tobeparsed.json');
  const updates = config.resultsdir + "" + util.GetStringDateFormat(new Date()) + "updates.json";
  if (!fs.exists(updates)) { return }
  const todayupdates = require(updates);

  if (todayupdates.newitems) {
    console.log("there are new items");
    todayupdates.newitems.forEach(function (band) {
      tobeparseddata.push(band);
    }, this);
    util.NodeWritetoFile("tobeparsed", tobeparseddata);
  }

  if (todayupdates.leftitems) {
    todayupdates.leftitems.forEach(function (band) {
      var name = band.name;
      var fname = _.snakeCase(band.name);
      var genre = _.replace(band.genre, '/', '-');;
      var output = config.resultsdir + "" + genre + "/" + fname + ".json";
      if (fs.exists(output)) {
        fs.remove(output);
      }
    }, this);
  }

}





//parsing records from the given url.Returns array of data
module.exports.parseRecords = function () {
var eidos=['StudioAlbums','LiveAlbums','Videos','Boxset','Singles'];
var albums = {};
eidos.forEach(function(element,index) {
  albums[element]=[];
  var temp=document.querySelectorAll("h3+table")[index].querySelectorAll("td");
    for (var i = 0; i < temp.length; i++) {
    album = {}
    album['title'] = temp[i].querySelector('strong').innerText;
    album['link'] = temp[i].querySelector('a').href;
    album['year'] = temp[i].querySelector('span:nth-of-type(3)').innerText;
    var rating = temp[i].querySelector('span:nth-of-type(1)').innerText;
    var users = temp[i].querySelector('span:nth-of-type(2)').innerText;
    album['result'] = Math.log(users) * rating
    albums[element].push(album);
  };
}, this);
return albums;
}


//returns any date to DDMMYYYY format
module.exports.GetStringDateFormat = function (date) {
  var check = moment(date, 'YYYY/MM/DD');
  var month = check.format('MM');
  var day = check.format('DD');
  var year = check.format('YYYY');
  return day + "" + month + "" + year;
}



//creates files with filename title and  data using node fs commands
module.exports.NodeWritetoFile =  function  (filename, data,mode="write") {
  const that = this
  var file = config.resultsdir + "" + "" + filename + "" + ".json";
  fs.open(file, 'w', function (err, fd) {
    if (err) { console.log(err) }
    if(mode=="write"){
      fs.writeSync(fd, JSON.stringify(data, null, '\t'), 0 , function (error, fd) {
        if (error) {
          console.log(error);
        }
      });
    }
    else{
      fs.appendFileSync(file, JSON.stringify(data, null, '\t') , function (error, fd) {
        if (error) {
          console.log(error);
        }
      })
    }
  })
}



module.exports.dataTofile = (data,successfile,errorlogfiles,mode) => 
{
  const file = config.resultsdir + "" + "" + successfile + "" + ".json";
  var finalData = data.filter(i => i && i[0] && i[0].letter);
  if(finalData.length){
    if(mode == "append" && this.fileExists(file)){
      this.readFile(file)
      .then((dataFromFile)=>{
        dataFromFile = dataFromFile?dataFromFile:[]
        finalData = dataFromFile.concat(finalData)
        this.NodeWritetoFile(successfile,finalData,"write")
      })
    }
    else{
      this.NodeWritetoFile(successfile,data,mode)
    }
    
  }

  const failedData =data.filter((i)=>(i && i[0] && !i[0].letter ))
  if(failedData.length){
    const failures = failedData.map((url)=>{
        return {
            "url":url
        }
    })  
    util.NodeWritetoFile(errorlogfiles,failures,mode)
}  
}




module.exports.checkForMissingData = (source,target)=>{
  return source.filter(x => !target.includes(x))

}



