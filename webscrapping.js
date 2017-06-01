
var bands=require('./bands/bands.json');

var casper = require('casper').create();
var url = 'http://www.progarchives.com/artist.asp?id=233';
var fs = require('fs');
var length;
 _und = require("lodash");
  


casper.on('remote.message', function (msg) {
    this.echo("Remote:" + msg);
})

casper.start(url);

casper.then(function () {
    this.waitForSelector('body');
});




var i=0;

var that=this;
casper.then(function() {
    this.each(bands, function() {
         var name=bands[i].name;
         // change the link being opened (has to be here specifically)
       this.thenOpen((bands[i].link), function() {
         var info = this.evaluate(apotelesma);
         fs.write("./bands/zeuhl/"+name+".json", JSON.stringify(info, null, '\t'), 'w');
                 
        });
        i++;
    });
});

casper.then(function(){
    console.log("done");
})

casper.run(function () {} );

