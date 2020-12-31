const express = require('express');
const app = express();
const path = require('path');
const routes = require('./app/routes.js');
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require('express-flash-messages');
var movieM = require("./src/models/Movie");

const db = require("./src/models/db.js");
db.getConnection();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'key bidon', resave:false, saveUninitialized:false, 
    cookie: {maxAge: 3600000} 
}));
app.use((req,res,next) => {
    res.locals.session = req.session; 
    next();
});
app.use((req,res,next) => {
    movieM.findAllGenres()
    .then((data)=>{
        res.locals.categories = data;
        next();
    })
});
app.use(flash());

app.use('/',routes);

app.use((req, res,next)=>{
    res.send('<h1> Page not found </h1>');
 });

const port = process.env.PORT || 3000;
app.listen(port);