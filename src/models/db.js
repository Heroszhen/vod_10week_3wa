const mongoose = require("mongoose");
var url = 'mongodb://localhost:27017/vod3wa';


exports.getConnection = function(){
	mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology:true});
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log("Connected");
	});
};