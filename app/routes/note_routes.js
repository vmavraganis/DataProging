var _ = require("lodash");
const bands = require('../../bands/bands.json');
const fs = require('fs');
const config = require('../../config');
const util = config.utilities;
const path = require('path');


module.exports = function (app, db) {

    app.post('/bands', (req, res) => {
        var country = req.body.country;
        var genre = req.body.genre;
        var name = req.body.onoma;
        genre = _.snakeCase(genre);
        country = _.startCase(country);
        name = _.upperCase(name);

        response = {}
        response['data'] = _.filter(bands, function (band) {

            var finalvar = true;

            if (country != "") {
                finalvar = finalvar && (band.country == country);
            }
            if (genre != "") {
                finalvar = finalvar && (_.snakeCase(band.genre) == genre);
            }
            return finalvar;
        });
        console.log(response.data.length);
        res.set('Bands', response.data.length)
        res.send(response);

    })

    app.get('/bands/:name/', function (req, res) {
        var name = req.params.name;
        name = _.upperCase(name);
        console.log(name);
        var finalvar = true;
        var Bands = []
        var response = {}
        var result = _.filter(bands, function (band) {
            if (name != "") {
                finalvar = (_.upperCase(band.name) == name);
            }
            return finalvar;
        });
        var count = result.length;

        if (count > 0) { response['data'] = result }
        else {
            response['data'] = [];
            res.set('Error_Message', "Band or artist not found");
            res.send(response);
            return;
        }
        console.log("artist found");


        res.set('Bands', response.data.length);




        result.forEach(function (band) {
            var name = band.name;
            var fname = _.snakeCase(band.name);
            var genre = _.replace(band.genre, '/', '-');
            var dir = "bands";
            var outputpath = path.resolve(dir, genre, fname + ".json");
            util.readJSONFile(outputpath, function (err, data) {
                if (err) { count = count - 1; throw err; }
                var resultband = {}
                resultband['country'] = band.country;
                // resultband['Title'] = data.title
                // resultband['studioalbums'] = data.studioalbums;
                // resultband['livealbums'] = data.livealbums;
                for (var prop in data){
                    resultband[prop]=data[prop];
                }
               // if(resultband.studioalbums)
                Bands.push(resultband);
                count = count - 1;
                if (count == 0)
                    res.send(Bands);
            });
        });

        //response=bands



    });


        app.get('/genres/:genre/', function (req, res) {
        var name = req.params.name;
        name = _.upperCase(name);
        console.log(name);
        var finalvar = true;
        var Bands = []
        var response = {}
        var result = _.filter(bands, function (band) {
            if (name != "") {
                finalvar = (band.genre == genre);
            }
            return finalvar;
        });
        var count = result.length;

        if (count > 0) { response['data'] = result }
        else {
            response['data'] = [];
            res.set('Error_Message', "Band or artist not found");
            res.send(response);
            return;
        }
        console.log("artist found");


        res.set('Bands', response.data.length);




        result.forEach(function (band) {
            var name = band.name;
            var fname = _.snakeCase(band.name);
            var genre = _.replace(band.genre, '/', '-');
            var dir = "bands";
            var outputpath = path.resolve(dir, genre, fname + ".json");
            util.readJSONFile(outputpath, function (err, data) {
                if (err) { count = count - 1; throw err; }
                var resultband = {}
                resultband['country'] = band.country;
                // resultband['Title'] = data.title
                // resultband['studioalbums'] = data.studioalbums;
                // resultband['livealbums'] = data.livealbums;
                for (var prop in data){
                    resultband[prop]=data[prop];
                }
               // if(resultband.studioalbums)
                Bands.push(resultband);
                count = count - 1;
                if (count == 0)
                    res.send(Bands);
            });
        });

        //response=bands



    });



    //  res.send(require(outputpath).livealbums);
    // fs.readFile(outputpath, 'utf8', function (err, data) {
    //     if (err)
    //         // error handling
    //         console.log(err);
    //     var obj = JSON.parse(data);
    //     console.log(obj);
    // });












    app.get('/genres', (req, res) => {
        var response=_
            .map(_.uniqBy(bands, 'genre'), function (band) { return band.genre; })
            .sort()
   
        res.send(response);
    });

    app.get('/countries', (req, res) => {
         var response=_
            .map(_.uniqBy(bands, 'country'), function (band) { return band.country; })
            .sort()
        
        res.send(response);
    });

}



