




var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0',
		
    }
});



/**
 * Add a listener for the phantomjs resource request.
 *
 * This allows us to abort requests for external resources that we don't need
 * like Google adwords tracking.
 */
casper.options.onResourceRequested = function(casper, requestData, request) {
  // If any of these strings are found in the requested resource's URL, skip
  // this request. These are not required for running tests.
  var skip = [
    'googleads.g.doubleclick.net',
    'cm.g.doubleclick.net',
    'www.googleadservices.com'
  ];

  skip.forEach(function(needle) {
    if (requestData.url.indexOf(needle) > 0) {
      request.abort();
    }
  })
};



const fs = require('fs');
const _ = require("lodash");
const config = require('./config');
const util = require(config.util);
const outputpath = config.outputpath;
const bands = require('./bands/bands.json');



casper.on('remote.message', function (msg) {
    this.echo("Remote:" + msg);
})

casper.start();

casper.then(function () {
    this.waitForSelector('body');
});






var that = this;
casper.then(function () {

    var that=this;
    bands.forEach(function (element, index, array) {
        var name = element.name;
        var fname = _.snakeCase(element.name);
        var genre = _.replace(element.genre, '/', '-');;
        var outputpath = config.resultsdir + "" + genre + "/" + fname + ".json";

        that.thenOpen((element.link), function () {
             var info={};
			 var res={}
			 info = this.evaluate(util.parseRecords);
             res['title']=name;
			 res['studioalbums']=info.studioalbums;//_.sortBy(info.studioalbums, ['result'],['desc']);
			 res['livealbums']=info.livealbums;//_.sortBy(info.livealbums, ['result'],['asc']);
             util.CasperWritetoFile(outputpath, res) ? console.log("file" + outputpath + " created") : console.log("An error occured");
        });
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

