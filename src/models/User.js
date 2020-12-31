var bcrypt = require('bcryptjs');

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    admin:Number 
});

var usermodel = mongoose.model("user",userSchema);
exports.model =  usermodel;

exports.addOneUser = function(user){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user["password"], salt, function(err, hash) {
            user["password"] = hash;
            user["admin"] = 0;
            return usermodel.create(user)
        });
    });  
}

exports.findOneUser = async function(user){
    
    let result = await usermodel.findOne({email:user.email});
    if(result !== null) {
        if(bcrypt.compareSync(user.password, result.password)) {
            delete result.password;
            return result;
        }
    }
    return false;

}