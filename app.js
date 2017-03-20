'use strict';


var express = require('express');

var compression = require('compression');

var cors = require('cors');
var iconv = require('iconv-lite');
var corsOptions = {
origin: '*' 
};
var bodyParser = require('body-parser')

//Init app and add middlewares
var app = express();
app.use(compression());
app.use(cors(corsOptions));


app.use(bodyParser.json())

app.use('/', express.static('public'));



app.post('/translate', function(req, res) {
   
});


//Comentar en caso de servidor https
app.listen(3002, function () {
console.log('Worker started on port ' + 3002);
});

        
