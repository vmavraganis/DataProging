var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
    }
});
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
    casper.page.close();
    var that=this;
    bands.forEach(function (element, index, array) {
        var name = element.name;
        var fname = _.snakeCase(element.name);
        var genre = _.replace(element.genre, '/', '-');;
        var outputpath = config.resultsdir + "" + genre + "/" + fname + ".json";

        that.thenOpen((element.link), function () {
            var info = this.evaluate(util.parseRecords);
            info['title']=name;
            util.CasperWritetoFile(outputpath, info) ? console.log("file" + outputpath + " updated") : console.log("An error occured");
        });
        
    });
})

casper.then(function () {
    console.log("done");
})

casper.run(function () { });

