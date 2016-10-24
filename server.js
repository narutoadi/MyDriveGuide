var express = require('express');
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require('body-parser');
var db;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/',function(req, res){

	res.sendFile(path.join(__dirname+'/public/index2.html'));
});

app.listen(3000);
console.log("Server running on port 3000");