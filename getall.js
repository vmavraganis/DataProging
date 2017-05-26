var casper = require('casper').create();
var fs = require('fs');
var _ = require("lodash");
var config=require('./config');
var url = config.bandsurl;
var util = require(config.util);
var outputpath = config.outputpath;
var tempfile=config.tempfile;
var updatefilepath=config.updatefilepath;

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

  util.createfile(info,outputpath,tempfile,updatefilepath);
   
    console.log("done");
    casper.exit();
});

casper.run(function () {

});
