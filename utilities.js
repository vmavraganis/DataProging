const fs = require('fs');
const config = require('./config');
const util = require('util');


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


//creates files with filename title and  data using node fs commands
module.exports.NodeWritetoFile =  function  (filename, data,mode=config.writeToFileModes.write) {
  const that = this
  var file = config.resultsdir + "" + "" + filename + "" + ".json";
  fs.open(file, 'w+', function (err, fd) {
    if (err) { console.log(err)
       return}
    if(mode==config.writeToFileModes.write){
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
        this.NodeWritetoFile(successfile,finalData,config.writeToFileModes.write)
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


