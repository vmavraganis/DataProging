var config = require('./config');
var util = require(config.util);
var outputpath = config.outputpath;
const _ = require('lodash');
const cheerio = require("cheerio");
const request = require("request");
const fs = require('fs');
const bands = require('./bands/bands.json');
var path = require('path');


var files = [];
var rightdata = [];


//create json with folder structure

// var dirTree = ('./bands');


// var diretoryTreeToObj = function(dir, done) {
//     var results = [];

//     fs.readdir(dir, function(err, list) {
//         if (err)
//             return done(err);

//         var pending = list.length;

//         if (!pending)
//             return done(null, {name: path.basename(dir), type: 'folder', children: results});

//         list.forEach(function(file) {
//             file = path.resolve(dir, file);
//             fs.stat(file, function(err, stat) {
//                 if (stat && stat.isDirectory()) {
//                     diretoryTreeToObj(file, function(err, res) {
//                         results.push({
//                             name: path.basename(file),
//                             type: 'folder',
//                             children: res
//                         });
//                         if (!--pending)
//                             done(null, results);
//                     });
//                 }
//                 else {
//                     results.push({
//                         type: 'file',
//                         name: path.basename(file)
//                     });
//                     if (!--pending)
//                         done(null, results);
//                 }
//             });
//         });
//     });
// };



// diretoryTreeToObj(dirTree, function(err, res){
//     (err)?console.error(err):util.NodeWritetoFile("struct",res);
// });




//create json file with list of bands filenames

//   var dirtree =require("./bands/struct.json");

//  for (var genre of dirtree) {
//     if (genre.children) {
//         files.push(genre.children)
//     };
// }
// //files = _.map(files, 'name');
// files = _.reduceRight(files, function (flattened, other) {
//     return flattened.concat(other);
// }, []);
// files = _.map(files, 'name');
// files.sort();
// util.NodeWritetoFile("filenames", files);



// for  (var band of bands ){
//     rightdata.push(_.snakeCase(band.name)+".json");
// }
// rightdata.sort();
// util.NodeWritetoFile("bandsonsite",rightdata);



//    var filenames =require("./bands/filenames.json");
//    var Bands =require("./bands/bandsonsite.json");
//    var diff=[];
// for(var i=0;i<filenames.length;i++){
//     filenames[i]==Bands[i]?"":diff.push(Bands[i]);
// }
// console.log(diff);




//  var missingbandsnames=_.difference(filenames,Bands);
//  var missingbandsnames2=_.difference(Bands,filenames);
//  console.log(missingbandsnames,missingbandsnames2);
//   console.log(Bands.length-filenames.length);

//  util.NodeWritetoFile("bandnames",names);
//  util.NodeWritetoFile("rightdata",rightdata);

// var files=require("./bands/bandnames.json");
// var sitebands=require("./bands/rightdata.json");
// sitebands.sort();
// files.sort();


// var missingbandsnames=_.difference(files,sitebands);
// var missingbandsnames2=_.difference(sitebands,files);

//  console.log(missingbandsnames,missingbandsnames2);



// var missingbandsnames=_.difference(rightdata,names);
// console.log(missingbandsnames);
// var missingbands=[];


// var test=  _.filter(bands,function(band) {missingbandsnames.forEach(function(needle) {
//     var name=_.snakeCase(band.name)+".json"
//     if (name.indexOf(needle) >= 0) {
//       return true
//     }
//   }) })





// util.NodeWritetoFile("bandnames",names);
// util.NodeWritetoFile("rightdata",rightdata);






