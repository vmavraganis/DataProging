var config = require('./config');
var util = require(config.util);
var outputpath = config.outputpath;
const _ = require('lodash');
const cheerio=require("cheerio");
const request=require("request");
const fs = require('fs');
const bands = require('./bands/test.json');



try {
    var spooky = require('spooky');
} catch (e) {
    var spooky = require('../lib/spooky');
}
 
var spooky = new spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
 
        spooky.start(
            'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost');
        spooky.then(function () {
            this.evaluate(function () {
                return document.title;
            });
        });
        spooky.run();
    });
 
spooky.on('error', function (e, stack) {
    console.error(e);
 
    if (stack) {
        console.log(stack);
    }
});
 
/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/
 
spooky.on('hello', function (greeting) {
    console.log(greeting);
});
 
spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});