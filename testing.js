var config=require('./config');
var util = require(config.util);
var outputpath = config.outputpath;
var bands=require(config.outputpath);
const _ = require('lodash');




/* webscapping
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
const config=require('./config');
const util = require(config.util);
const outputpath = config.outputpath;
const bands=require('./bands/test.json');


 */

// var test="mamo th mama sou";
// util.updateBands("gamo th mana sou",outputpath);




// _.filter(bands, function(o) { return !o.active; });

// (/^[a-zA-Z0-9- ]*$/.test(str))


    


// var gamimenesbades= _.filter(bands, function(o) { return (/w*([<>"*:\/?|]\w*)/.test(o.name)) });
// console.log(gamimenesbades);


var genre="Post Rock/Math rock";
genre=_.replace(genre, '/', '-');
console.log(genre);


var fname=_.snakeCase(bands[1].name);
    var genre=_.replace(genre, '/', '-');;

//util.NodeWritetoFile("test",renamings)

// var wrapped = _([1, 2, 3]);
 
// // Returns an unwrapped value.
// wrapped.reduce(_.add);
// // => 6
 
// // Returns a wrapped value.
// var squares = wrapped.map(square);
 
// _.isArray(squares);
// // => false
 
// _.isArray(squares.value());
// // => true