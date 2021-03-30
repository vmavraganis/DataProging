const fs = require('fs');
const config = require('./config');
const util = require('util');
const moment = require('moment');



module.exports.fileExists = (path) =>{
  return fs.existsSync(path)
}

module.exports.readFile = (filename)=>{
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      else{
        resolve(JSON.parse(data));

      }
    });
  });
}


//creates files with filename title and  data using node fs commands
module.exports.NodeWritetoFile =  function  (filename, data,mode=config.writeToFileModes.write) {
  var file = config.resultsdir + "" + "" + filename + "" + ".json";

  return new Promise(async(resolve,reject)=>{

    try {
      if(mode==config.writeToFileModes.write){
      const success = await fs.promises.writeFile(file, JSON.stringify(data, null, '\t')); // need to be in an async function
      console.log("File Succesfully Created: "+file)
      resolve(success)
    }
     else{ 
      const success = await fs.promises.appendFile(file, JSON.stringify(data, null, '\t')); // need to be in an async function
      console.log("File Succesfully Updated: "+file)
      resolve(success)
    }

    } catch (error) {
      reject(error)
    }


  })
  
}



module.exports.dataTofile = (data,successfile,errorlogfiles,mode) => 
{
return new Promise(async(resolve,reject)=>{
  try{
     await logData(data,mode,successfile)
     await logErrors(data,mode,errorlogfiles)
     resolve([])
  }
  catch(err){
    reject(err)
  }
})
  

}

logData = async(data,mode,successfile)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      const file = config.resultsdir + "" + "" + successfile + "" + ".json";
      var finalData = data.filter(i => i && i[0] && i[0].letter);
      if(finalData.length){

        finalData = finalData.map((letter)=>{
                          return letter?letter.map((artist)=>{
                                  return (artist.progArchivesID)?{
                                      ...artist,
                                      progArchivesID:artist.progArchivesID.substring((artist.progArchivesID.indexOf("=")) + 1, artist.progArchivesID.length)
                              }:artist
                          }):letter
                      })

        if(mode == "append" && this.fileExists(file)){
          this.readFile(file)
          .then(async(dataFromFile)=>{
            dataFromFile = dataFromFile?dataFromFile:[]
            finalData = dataFromFile.concat(finalData)
            resolve(await this.NodeWritetoFile(successfile,finalData))

          })
        }
        else{
          resolve(await this.NodeWritetoFile(successfile,finalData,mode))
        }
        
      }
    }
    catch(err){
      reject(err)
    }  
})
}


logErrors = (data,mode,errorlogfiles)=>{
  return new Promise(async(resolve,reject)=>{
    try{
    
    const failedData =data.filter((i)=>(i && i[0] && !i[0].letter ))
    if(!failedData.length) resolve([])
    if(failedData.length){
     const failures= [].concat(failedData.map((url)=>{
          return {
              "url":url
          }
      }))  
      resolve(await this.NodeWritetoFile(errorlogfiles,failures,config.writeToFileModes.write))
  } 
  
    }
    catch(err){
      reject(err)
    }  
})
}

module.exports.checkForMissingData = (source,target)=>{
  return source.filter(x => !target.includes(x))

}



module.exports.arrayToChunks = (input,perChunk)=>{
  return input.reduce((all,one,i) => {
    const ch = Math.floor(i/perChunk); 
    all[ch] = [].concat((all[ch]||[]),one); 
    return all
 }, [])
}





module.exports.promiseResolver=(handlefn)=>{

  const series = urls.reduce(async (queue, number) => {
    const dataArray = await queue;
    dataArray.push(await handlefn(number));
    return dataArray;
}, Promise.resolve([]));

return series
}

const f = (chunk,handlefn) => new Promise((resolve,reject)=>{
  try{
      resolve(handlefn(chunk))
  }
  catch(err){
      reject(err)
  }
  
})

const executeChunc= async(chunks,handlefn)=>{
  for (let job of chunks.map(x => () => f(x,handlefn)))
  await job()

}

module.exports.GetStringDateFormat = function (date) {
  var check = moment(date, 'YYYY/MM/DD');
  var month = check.format('MM');
  var day = check.format('DD');
  var year = check.format('YYYY');
  return day + "" + month + "" + year;
}


module.exports.executeChunc = executeChunc



