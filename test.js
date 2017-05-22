 _und = require("./underscore.js");
  
 var namelinks=
_und
.chain(bands)
.map(function(band) {
    return {
            link:band.link
    }
})
.value();

var i = 0;
var nTimes = namelinks.length;

casper.repeat(nTimes, function() {
    //... do your stuff
    i++;
});