var movie = require("../models/Movie");
var s1 = require("../services/service1");

exports.allFilms = function(req,res,next){
    movie.findAllMovies()
    .then((docs)=>{
        //console.log(docs)
        res.render("adminallmovies.pug",{movies:docs.reverse()});
    });
    
}


exports.addOneFilm = function(req,res,next){
    req.flash('', '');
    res.render("adminmovie.pug",{
        idthemoviedb:0,
        title:"",
        actors:"",
        country:"",
        genres:"",
        plot:"",
        last:"",
        photo:"",
        vdieo:"",
        release:""
    });
}

exports.traitAddOneFilm = function(req,res,next){
    let post = req.body;
    if(post.title == "" || post.actors == "" || post.country == "" || post.plot == "" || post.last == "" || post.release == ""){
        req.flash('error', 'Veuillez remplir tous les champs');
        res.render("adminmovie.pug",{
            idthemoviedb:post.idthemoviedb,
            title:post.title,
            actors:post.actors,
            country:post.country,
            genres:post.genres,
            plot:post.plot,
            last:post.last,
            photo:post.photo,
            video:post.video,
            release:post.release
        });
    }else{
        movie.findBy({title:post.title,plot:post.plot})
        .then((docs)=>{return docs;})
        .then((data)=>{
            if(data.length != 0){
                req.flash('error', 'Ce film a déjà été enregistré');
                res.render("adminmovie.pug",{
                    idthemoviedb:post.idthemoviedb,
                    title:post.title,
                    actors:post.actors,
                    country:post.country,
                    genres:post.genres,
                    plot:post.plot,
                    last:post.last,
                    photo:post.photo,
                    video:post.video,
                    release:post.release
                });
            }else{
                movie.addOneMovie(post)
                .then((result)=>{
                    res.redirect("/admin/tous-les-films");
                });
            }
        });
    }
}

exports.deleteOneFilm = function(req,res,next){
    let id = req.params.id;
    movie.deleteOneMovie(id)
    .then((result)=>{
        //console.log(result);
        res.redirect("/admin/tous-les-films");
    });
    
}

exports.updateOneFilm = function(req,res,next){
    req.flash('', '');
    let id = req.params.id;
    movie.getOneMovie(id)
    .then((doc)=>{
        let ob = {
            id:id,
            idthemoviedb:doc["idthemoviedb"],
            title:doc["title"],
            actors:doc["actors"],
            country:doc["country"],
            genres:doc["genres"],
            plot:doc["plot"],
            last:doc["last"],
            photo:doc["photo"],
            video:doc["video"],
            release:s1.date_forme_en(doc["release"])
        }
        res.render("adminmovie2.pug",ob);
    });
}

exports.traitUpdateOneFilm = function(req,res,next){
    let post = req.body;
    let id = req.params.id;
    let ob = {
        id:id,
        idthemoviedb:post.idthemoviedb,
        title:post.title,
        actors:post.actors,
        country:post.country,
        genres:post.genres,
        plot:post.plot,
        last:post.last,
        photo:post.photo,
        video:post.video,
        release:post.release
    }
    movie.updateOneMovie(ob)
    .then((doc)=>{
        req.flash('notify', 'Vos modifications ont été enregistrées avec succès');
        ob["id"] = id;
        ob["release"] = post.release;
        res.render("adminmovie2.pug",ob);
    });
}