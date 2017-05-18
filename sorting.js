 var bands = require('./bands/bands.json');
 _und = require("./underscore.js");
 var fs = require('fs');

 var band=require('./bands/hawkwind.json')

var writetofile=function(msgname,msg){
  
  var file=`./bands/${msgname}.json`
  console.log(file);
fs.open(file, 'w', function(err, fd) {
  fs.write(fd, JSON.stringify(msg, null, '\t'), 'w');
  fs.close(fd);
});

}

// var result=[];
// let countries=
// _und
// .chain(bands)
// .groupBy(function(band){ return band.genre})
// .pairs()
// .forEach(function(element) {
// let res={};
// res.genre=element[0];
// res.countries=_und.chain(element[1])
//               .countBy(function(band){ return band.country})
//               .map(function(cnt, country) {
                     
//         return {count:cnt,
//                 country:country,
//                 result:" "+country+" : "+cnt            
//                 }
//                 })
//         .sortBy('count').reverse()
//         .pluck('country')
//              ;
// result.push(res);

//  }, this)
//  .values();

// fs.open('bandss.json', 'w', function(err, fd) {
//   fs.write(fd, JSON.stringify(result, null, '\t'), 'w');
//   fs.close(fd);
// });
// console.log("done");


let sortedalbums=
_und
.chain(band)
.sortBy(function(album){ return album.result}).reverse()
.value();

console.log("done");

namelinks=
_und
.chain(bands)
.map(function(band) {
    return {name:band.name,
            link:band.link
    }
})
.value();

writetofile("sortedalbums",sortedalbums);













// let genres=_und
// .chain(bands)
// .groupBy(function(band){ return band.genre})
// .pairs()
// .value()


// console.log(genres);


// _und.forEach(result,function(genre){
//         genre.genre
//        // console.log(genre.genre);
//      _und.forEach(genre.bands,function(country){
//          //     console.log("hello");
//       })
// })


// let res=_und
// .chain(bands)
// .filter(function(band){ return band.genre =="Krautrock"})
// .pluck("name")
// .value()
// ;

// console.log(res);