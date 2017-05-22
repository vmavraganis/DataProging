
 var bands = require('./bands/bands.json');
 _und = require("./underscore.js");
 var fs = require('fs');



var writetofile=function(msgname,msg){
  var file=`./bands/${msgname}.json`
  console.log(file);
fs.open(file, 'w', function(err, fd) {
  fs.write(fd, JSON.stringify(msg, null, '\t'), 'w');
  fs.close(fd);
});

}

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

writetofile("genres",genres);
console.log("done");
