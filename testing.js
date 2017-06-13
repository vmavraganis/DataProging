var config = require('./config');
var util = require(config.util);
var outputpath = config.outputpath;
const _ = require('lodash');
const cheerio=require("cheerio");
const request=require("request");
const fs = require('fs');
const bands = require('./bands/bands.json');


console.log(bands.length);



