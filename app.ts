/// <reference path="./typings/tsd.d.ts" />

import {findUser} from "./DBRepo/UserModel"

var GeneralRoutes = require("./routes/general");

import express 	= require("express");
import path		= require("path");
import bodyParser = require("body-parser");
import mongoose = require("mongoose");


let app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.set('port', (process.env.PORT || 5000));



let staticDIR = path.resolve(__dirname, "./static");
app.use(express.static(staticDIR));
app.use(bodyParser.json());


app.use(function(req, res, next){
	//next();
	if(req.query.token){
		findUser({FirebaseToken : req.query.token})
		.then(function(dbUser){
			
			if(dbUser){
				req.user = dbUser;
				next();	
			}
			
		}, function(err){
			next(err);
		});
	} else {
		next();
	}
});

app.use("/api", GeneralRoutes);



app.get("*", (req:express.Request, res:express.Response)=>{
	let indexViewPath = path.resolve(__dirname, "./static/adminPortal/index.html");
	res.sendFile(indexViewPath);
});


app.listen(app.get("port"), ()=>{
	console.log("Server in listening state on " + app.get("port"));
});
mongoose.connect('mongodb://junaidahmed093:aries1993@ds039175.mongolab.com:39175/salesman');