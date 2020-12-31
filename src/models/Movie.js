var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var movieSchema = new Schema({
    idthemoviedb:Number,
    title:String,
    actors:String,
    country:String,
    genres:String,
    plot:String,
    last:String,
    photo:String,
    video:String,
    release:Date,
    comments:[
        {
            userid:String,
            firstname:String,
            lastname:String,
            email:String,
            message:String,
            created:Date
        }
    ]
});

var moviemodel = mongoose.model("movie",movieSchema);
//exports.model =  usermodel;

exports.findBy = async function(data){
    return await moviemodel.find(data);
}

exports.addOneMovie = async function(movie){
    movie["release"] = new Date(movie["release"]);
    movie["comments"] = [];
    await moviemodel.create(movie)
}

exports.findAllMovies = async function(){
    return await moviemodel.find({});
}

exports.deleteOneMovie = async function(id){
    return await moviemodel.findByIdAndDelete(id);
}

exports.getOneMovie = async function(id){
    return await moviemodel.findById(id);
}

exports.updateOneMovie = async function(movie){
    let id = movie["id"];
    delete movie["_id"];
    movie["release"] = new Date(movie["release"]);
    return await moviemodel.findByIdAndUpdate(id, movie,{new: true, useFindAndModify: false});
    //return await moviemodel.updateOne({"_id":id},movie);
}

exports.findAllGenres = async function(){
    let tab = [];
    let results = await moviemodel.find({});
    results.forEach(elm=>{
        let tmp = elm["genres"].split(",");
        tmp.forEach(elm2=>{
            if(!tab.includes(elm2))tab.push(elm2);
        })
    });
    tab.sort();
    return tab;
}

exports.addOneComment = async function(movieid,comment){
    return await moviemodel.updateOne(
        { _id: movieid }, 
        { $push: { comments: comment } 
    });
}

exports.findOneComment = async function(movieid,comment){
    return await moviemodel.findOne({_id:movieid},{ comments: {$elemMatch:comment}})
}

exports.deleteOneComment = async function(movieid,commentid){
    return await moviemodel.findByIdAndUpdate(movieid,{$pull:{"comments":{"_id":commentid}}},{new: true, useFindAndModify: false});
}