var casper = require('casper').create();
var url = 'http://www.progarchives.com/bands-alpha.asp?letter=*';
var fs = require('fs');
var length;
var start = Date.now();
// the event you'd like to time goes here:

casper.on('remote.message', function (msg) {
    this.echo("Remote:" + msg);
})

casper.start(url);

casper.then(function () {
    this.waitForSelector('table');
});
//*[@id="main"]/div[2]/table/tbody/tr[2]/td[1]/a

casper.then(function () {
    var info = this.evaluate(function () {
        var table_rows = document.querySelectorAll("tbody tr"); //or better selector
        var artists = [];
        for (var i = 1; i < table_rows.length; i++) {            
            columns = table_rows[i].querySelectorAll('td');
            
           
                artists.push({
                    'name': columns[0].innerText,
                    'genre': columns[1].innerText,
                    'country': columns[2].innerText,
                    'link':columns[0].childElements(0)[0].href
                });                
        }
        return artists;
    });

    fs.write('./bands/bands.json', JSON.stringify(info, null, '\t'), 'w');
    console.log("done");
    
});


casper.run(function () {
    
});