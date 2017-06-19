const config = require('./config');
const util = require(config.util);
const outputpath = config.outputpath;
const fs = require('fs');
const _ = require('lodash');
const rp=require('request-promise');
const countries=require('./bands/countries');
const bands=require('./bands/bands.json');
// var chainpromises=[];
// countries.forEach(function(country) {
//     chainpromises.push(rp('https://restcountries.eu/rest/v2/name/'+country))
// }, this);

// var countrycodes={};

// Promise.all(chainpromises)
// .then(values => { 
//   values.forEach(function(element) {
//       var test=JSON.parse(element);
//             countrycodes[test[0].name]=test[0].alpha3Code;
//   }, this);
//   util.NodeWritetoFile("countrycodes",countrycodes)
// })
// .catch(reason => { 
//   console.log(reason)
// });
// countries.forEach(function(element) {
//     console.log(codes[element])
// }, this);

var seen = {};
var hasDuplicates = bands.some(function (currentObject) {
    return seen.hasOwnProperty(currentObject.name)&&seen.hasOwnProperty(currentObject.genre)
        || (seen[currentObject.name] = false);
});

util.NodeWritetoFile("testtt",seen)


for(var band in seen){
    if(band.name){
    console.log(band+""+":"+band.name)}
}




