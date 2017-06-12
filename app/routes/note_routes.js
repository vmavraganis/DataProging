var _ = require("lodash");
const bands = require('../../bands/bands.json');

module.exports = function (app, db) {

    app.post('/bands', (req, res) => {
        let country = req.body.country;
        let genre = req.body.genre;
        let name = req.body.onoma;
        genre = _.snakeCase(genre);
        country = _.startCase(country);
        name = _.upperCase(name);

        response = {}
        response['data'] = _.filter(bands, function (band) {

            let finalvar = true;

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
        let finalvar=true;
     
        response = {}
        response['data'] = _.filter(bands, function (band) {
            if (name != "") {
                finalvar = (_.upperCase(band.name) == name);
            }
            
            return finalvar;
        });
        res.set('Bands', response.data.length);
        res.send(response);
    });

    app.get('/genres', (req, res) => {

        res.send(_
            .map(_.uniqBy(bands, 'genre'), function (band) { return band.genre; })
            .sort())
    });

    app.get('/countries', (req, res) => {

        res.send(_
            .map(_.uniqBy(bands, 'country'), function (band) { return band.country; })
            .sort())
    });

}



