var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
    }
});

var fs = require('fs');
var _ = require("lodash");
var config=require('./config');
var url = config.bandsurl;
var util = require(config.util);
var outputpath = config.outputpath;


console.log(url);


casper.on('remote.message', function (msg) {
    this.echo("Remote:" + msg);
})
casper.on('console.log()', function (msg) {
    this.echo("Remote:" + msg);
})


 casper.start(url);

 
 casper.then(function () {
     this.waitForSelector('table');
 });

 casper.then(function () {
    var info = this.evaluate(util.parsebands);

  util.updateBands(info,outputpath);
   
     console.log("done");
     casper.exit();
    
 });

 casper.run(function () {

 });
