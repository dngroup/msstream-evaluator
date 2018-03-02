const express = require('express')
var bodyParser = require('body-parser')
const app = express()

var port = 3000;

var prices = {            
    playerService: 0,
    encodingService: {
        pricePerMinute: 0,
        rent: 0
    },
    hostingService: {
        priceData: 0,
        priceStorage: 0
    }
  }

app.use(bodyParser.json());

app.use(express.static('dist'))

app.get('/api/prices', (req, res) => res.send(prices));

app.post('/api/prices', (req, res) => {
    //var json = JSON.parse(req.body);
    prices.playerService = parseFloat(req.body.playerService);
    prices.encodingService.rent = parseFloat(req.body.encodingService.rent);
    prices.encodingService.pricePerMinute = parseFloat(req.body.encodingService.pricePerMinute);
    prices.hostingService.priceData = parseFloat(req.body.hostingService.priceData);
    prices.hostingService.priceStorage = parseFloat(req.body.hostingService.priceStorage);
    res.sendStatus(200);
});



app.listen(port, () => console.log('Listening on port ' + port));