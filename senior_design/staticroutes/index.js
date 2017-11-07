app = require('../app');
var express = require('express');
var path = require('path');

app.use('/', express.static(path.join(__dirname + '/../public/home/')));

//app.use('/html', express.static(__dirname + '/../public/HTML'));

app.use('/js', express.static(path.join(__dirname + '/../public/js/')));

app.use('/angular', express.static(path.join(__dirname + '/../node_modules/angular/')));

app.use('/css', express.static(path.join(__dirname + '/../node_modules/bootstrap/dist/css')));

app.use('/jsqr', express.static(path.join(__dirname + '/../node_modules/jsqr/dist/')));