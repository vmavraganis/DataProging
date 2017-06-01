
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

 var apotelesma = function () {
       var categories=document.querySelectorAll("h3+table");
         var studioalbums=categories[0].querySelectorAll("td");
         var albums=[];
         var album;
    for (var i = 0; i < studioalbums.length; i++) {        
        album={}
        album['title']=studioalbums[i].querySelector('strong').innerText;
        album['link']=studioalbums[i].querySelector('a').href;
        album['year']=studioalbums[i].querySelector('span:nth-of-type(3)').innerText;
        album['rating']=studioalbums[i].querySelector('span:nth-of-type(1)').innerText;
        album['users']=studioalbums[i].querySelector('span:nth-of-type(2)').innerText;
        //album['result']=Math.log(users)*rating
        albums.push(album);
   
    
    
    };
          return albums ; 

        

   };