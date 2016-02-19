var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var animal = require('./routes/animal');


// bring in pg module
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/our_zoo'
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// get data route
app.get('/animal', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM animals ORDER BY animal_name DESC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            //done();
            client.end(); // shuts down all connections
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});


// set up database and animal route
app.post('/animal', function(req, res) {
    var addAnimal = {
        animal_name: req.body.animalName
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO animals (animal_name) VALUES ($1) RETURNING id",
            [addAnimal.animal_name],
            function (err, result) {
                done(); // call done and close connection so that you will still see responses on the dom. pg has a 10 connection max. need this anytime you do a pg connection. if you restart the server you won't see this happen, so you need to close it here.
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});


app.set('port', process.env.PORT || 3000);

app.use('/animal', animal);

app.get('/*', function(req, res) {
    console.log("Here is the request: " , req.params);
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public/', file));

});


app.listen(app.get('port'), function() {
    console.log('Server is ready on port ' + app.get('port'));
});
