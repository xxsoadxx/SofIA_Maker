'use strict';


var express = require('express');

var compression = require('compression');
var fs = require('fs');
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


//app.use(bodyParser.json())
app.use(function (req, res, next) {

    if (req.method == 'POST') {

        var chunks = [];

        req.on('data', function (data) {
            chunks.push(data);
        });

        req.on('end', function () {

            // Convert from an encoded buffer to js string. 
            var str = iconv.decode(new Buffer.concat(chunks), 'UTF-8');

            try {
                req.body = str;
                next();
            } catch (e) {
                var result = {
                    success: false,
                    severity: 'E',
                    message: 'Información recibida no valida',
                    code: 'FORMAT_ERROR'
                };
                res.status(400).json(result);
            }



        });
    } else {
        
            next();
      

    }
}
);
app.use('/', express.static('public'));



app.post('/save', function (req, res) {
    fs.writeFile("archivofinal.rive", req.body, function(err) {
        if(err) {
            return console.log(err);
        }
        res.send("OK");
        console.log("The file was saved!");
    }); 
});


//Comentar en caso de servidor https
app.listen(3002, function () {
    console.log('Worker started on port ' + 3002);
});


