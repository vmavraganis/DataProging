var config = require('./config');
var util = require(config.util);
var outputpath = config.outputpath;
const _ = require('lodash');
const cheerio=require("cheerio");
const request=require("request");
const fs = require('fs');
const bands = require('./bands/bands.json');
var path = require('path');
var dirtree=require('./bands/struct.json');

var names=[];
var rightdata=[];



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
//     if(err)
//         console.error(err);

//     util.NodeWritetoFile("struct",res);
// });






// for  (var genre of dirtree ){
//   if(genre.children){
//     names.push(genre.children)};
// }
  
//   names=_.reduceRight(names, function(flattened, other) {
//    return flattened.concat(other);
//  }, []);

// for  (var band of bands ){
//     rightdata.push(_.snakeCase(band.name)+".json");
// }

// names=_.map(names, 'name')

//  var missingbandsnames=_.difference(rightdata,names);
//  console.log(missingbandsnames);

//  util.NodeWritetoFile("bandnames",names);
//  util.NodeWritetoFile("rightdata",rightdata);

var files=require("./bands/bandnames.json");
var sitebands=require("./bands/rightdata.json");
sitebands.sort();
files.sort();


var missingbandsnames=_.difference(files,sitebands);
var missingbandsnames2=_.difference(sitebands,files);

 console.log(missingbandsnames,missingbandsnames2);



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



