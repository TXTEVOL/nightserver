const express = require('express');
const path = require('path'); // core module
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
var methodOverride = require('method-override');
const config = require('./config/database');

// Connect to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
    console.log('Database error: ' + err);
});

const app = express();

const port = process.env.PORT || 8080; // Set to 3000 if local

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

const Program = mongoose.model('Program', {
    title: {
        type: String
    },
    description: {
        type: String,
    },
    category: {
        type: Array,
    },
    favorite: {
        type: Boolean,
    }
});

app.get('/programs', function(req, res) {
 
    console.log("fetching programs");

    // use mongoose to get all programs in the database
    Program.find(function(err, programs) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(programs); // return all programs in JSON format
    });
});

app.get('/programs/:category', function(req, res) {
 
    console.log("fetching programs");

    // use mongoose to get all programs in the database
    Program.find({category: req.params.category},function(err, programs) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(programs); // return all programs in JSON format
    });
});

app.get('/favorites', function(req, res) {
 
    console.log("fetching programs");

    // use mongoose to get all programs in the database
    Program.find({favorite: true},function(err, programs) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(programs); // return all programs in JSON format
    });
});

app.put('/program/:id/:toggle', function(req, res) {
 
    console.log("updating programs");

    // use mongoose to get all programs in the database
    Program.update({_id: req.body._id}, {$set: {favorite: req.body.toggle}});
});

// Start Servers
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
