var user = require("../models/User");
var movie = require("../models/Movie");
const { move } = require("../../app/routes");

exports.index = function(req,res,next){
    res.render("home.pug");
}

exports.register = function(req,res,next){
    req.flash('', '');
    res.render("register.pug",{
        firstname:"",
        lastname:"",
        email:"",
        password:""
    });
}
exports.traitregistion = function(req,res,next){
    let post = req.body;
    let ob = {
        code:"2",
        msgalert:"",
        firstname:post.firstname,
        lastname:post.lastname,
        email:post.email,
        password:post.password
    }
    if(post.firstname == "" || post.lastname == "" || post.email == "" || post.password == ""){
        req.flash('error', 'Veuillez remplir tous les champs');
    }else{
        user.addOneUser(ob);
        ob = {
            code:"",
            msgalert:"",
            firstname:"",
            lastname:"",
            email:"",
            password:""
        }
        req.flash('notify', "Votre inscription a été faite avec succès");
    }
    res.render("register.pug",ob);
}

exports.connection = function(req,res,next){
    req.flash('', '');
    res.render("connection.pug",{
        email:"",
        password:""
    });
}
exports.traitconnection = function(req,res,next){
    let post = req.body;
    let ob = {
        email:post.email,
        password:post.password
    }
    if(post.email == "" || post.password == ""){
        req.flash('error', 'Veuillez remplir tous les champs');
        res.render("connection.pug",ob);
    }else{
        user.findOneUser(ob)
        .then((data)=>{
            if(data != false){
                req.session.user = data;
                res.redirect("/");
            }else{
                req.flash('error', 'Erreurs');
                res.render("connection.pug",ob);
            }
        });
    }
}

exports.logout = function(req,res,next){
    delete req.session.user;
    res.redirect("/");
}

exports.getFilmsByCategory = function(req,res,next){
    let name = req.params.name;
    let ob = {
        category:name
    };
    let query = {"genres":{"$regex":name,"$options":"i"}};
    movie.findBy(query)
    .then((docs)=>{
        ob["films"] = docs;
        res.render("onecategory.pug",ob);
    });
    
}

exports.getOneFilmById = function(req,res,next){
    let id = req.params.id;
    let query = {"_id":id};
    movie.findBy(query)
    .then((docs)=>{
        docs[0]["comments"].reverse();
        let ob = {
            film:docs[0]
        };
        res.render("onemovie.pug",ob);
    });
}

exports.searchFilms = function(req,res,next){
    let post = req.body;
    let kw = post.keywords;
    if(kw == "" || kw == undefined)res.render("movies.pug",{search:'',films:[]});
    else{/*
        let query = {
            $or : [
                {title:{$search:kw}},
                {actors:{$search:kw}},
                {country:{$search:kw}},
                {plot:{$search:kw}}
            ]
        };*/
        let query = {
            $or : [
                {title:{'$regex': kw, '$options': 'i'}},
                {actors:{'$regex': kw, '$options': 'i'}},
                {country:{'$regex': kw, '$options': 'i'}},
                {plot:{'$regex': kw, '$options': 'i'}}
            ]
        };
        movie.findBy(query)
        .then((docs)=>{
            let ob = {
                search:kw,
                films:docs
            };
            res.render("movies.pug",ob);
        });
    }
}

exports.setComment = function(req,res,next){
    let movieid = req.params.id;
    let post = req.body;
    let user = req.session.user;
    let comment = {
        userid:user["_id"],
        firstname:user["firstname"],
        lastname:user["lastname"],
        email:user["email"],
        message:post.comment,
        created:new Date()
    }

    movie.addOneComment(movieid,comment)
    .then(()=>{return movie.findOneComment(movieid,comment)})
    .then((data)=>{
        res.render("onecomment.pug",{comment:data["comments"][0]});
    })
    //res.send(user["firstname"]);
}

exports.deleteComment = function(req,res,next){
    let ids = req.params.id;
    let tab = ids.split("_");
    let movieid = tab[0];
    let commentid = tab[1];
    movie.deleteOneComment(movieid,commentid)
    .then((result)=>{
        res.send("1");
    });
    
}