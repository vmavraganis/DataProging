// var fs=require('fs');


var fs = require('fs');

var targetPath="home";

  
  var checkFileExists=function(targetPath) {        
      var exists=true;
      try {
         fs.statSync(targetPath);
        // file does not exist-
        
      }
      catch(err){
        exists=false; 
      }
      finally{
        return exists;
      }       
    }


console.log(checkFileExists(targetPath));














