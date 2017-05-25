var oldbands = require('./bands/bandsold.json');
var bands = require('./bands/bands.json');
_und = require("./underscore.js");
var fs = require('fs');




var writetofile=function(msgname,msg){
    
  var file=`./bands/${msgname}.json`
  console.log(file);
 fs.open(file, 'w', function(err, fd) {
     if(err){console.log(err)}
   fs.write(fd, JSON.stringify(msg, null, '\t'), 'w',function(error,fd){
       if (error){
           console.log(error);
       }
   });
   
 });

}


/* create one file per genre */
 var genres=
 _und
.chain(bands)
.countBy(function(band){ return band.genre})
.map(function(cnt,genre) {
        return {genre:genre
        }
    })
.pluck("genre")
;

genres.forEach((genre)=>{
     var eidos=
 _und
 .chain(bands)
.filter(function(band){
    return band.genre==genre
 })
 .value();
var Genre=String(genre.replace(/[^A-Z0-9]/ig, ""));
writetofile(Genre,eidos)

} );

