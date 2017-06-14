




var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0',
		
    }
});




casper.options.onResourceRequested = function(casper, requestData, request) {

   var check = [
    'www.progarchives.com'
  ];
  check.forEach(function(needle) {
    if (requestData.url.indexOf(needle) < 0) {
      request.abort();
    }
  })
};

const fs = require('fs');
const _ = require("lodash");
const config = require('./config');
const util = config.utilities;
const outputpath = config.outputpath;
const bands = require('./bands/bands.json');



casper.on('remote.message', function (msg) {
    this.echo("Remote:" + msg);
})

casper.on('err', function (msg) {
    this.echo("error:" + msg);
})

casper.start();

casper.then(function () {
    this.waitForSelector('body');
});


var that = this;
casper.then(function () {

    var that=this;
    bands.forEach(function (band) {
        var name = band.name;
        var fname = _.snakeCase(band.name);
        var genre = _.replace(band.genre, '/', '-');;
        var outputpath = config.resultsdir + "" + genre + "/" + fname + ".json";
        var exists = fs.exists(outputpath);
        if(!exists){

        that.thenOpen((band.link), function () {
             var info={};
			 var res={}
			 info = this.evaluate(util.parseRecords);
             res['title']=name;
			 res['studioalbums']=info.studioalbums;//_.sortBy(info.studioalbums, ['result'],['desc']);
			 res['livealbums']=info.livealbums;//_.sortBy(info.livealbums, ['result'],['asc']);
             util.CasperWritetoFile(outputpath, res) ? console.log("file" + outputpath + " created") : console.log("An error occured");
        });}
        that.clearMemoryCache()
        
    });
})

casper.then(function () {
    console.log("done");
	
})

casper.then(function() {
    this.exit();
});

casper.run(function () { });

