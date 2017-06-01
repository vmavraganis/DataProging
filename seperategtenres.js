var oldbands = require('./bands/bandsold.json');
var bands = require('./bands/bands.json');
_ = require("lodash");
var fs = require('fs');







/* create one file per genre */
 var genres=
 _
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
 _
 .chain(bands)
.filter(function(band){
    return band.genre==genre
 })
 .value();
var Genre=String(genre.replace(/[^A-Z0-9]/ig, ""));
writetofile(Genre,eidos)

} );

