var _ = require("lodash");
const bands = require('../../bands/bands.json');

module.exports = function (app, db) {
    app.post('/bandsofcountry', (req, res) => {
       
        let country = req.body.country;
        if(!country){
            res.send("Invalid or empty country");
        }
       res.send( _
            .chain(bands)
            .filter(function (band) { return band.country == country }))

    });
   app.post('/bandsofgenre', (req, res) => {
        
        let genre = req.body.genre;
        console.log(req.body);
        if(!genre){
            res.send("Invalid or empty genre");
        }
       res.send( _
            .chain(bands)
            .filter(function (band) { return band.genre == genre }))

    });
   app.post('/bandsofgenrecountry', (req, res) => {
        
        let genre = req.body.genre;
        let country=req.body.country;
        console.log(req.query.page);
        console.log("bands per page:"+req.query.items);
        
        if(!genre||!country){
            res.send("Invalid or empty genre or country");
        }
       res.send( _
            .chain(bands)
            .filter(function (band) { return (band.genre == genre &&band.country==country) }))

    });
};

