var express = require("express");
var app = express();
var router = express.Router();
var axios = require("axios");
 var request = require("request");
var bodyParser = require('body-parser');
var fs = require('fs');
var path = __dirname + '/views/';
var filepath = __dirname + '/downloadtoData.js';
var configAxios = require( __dirname +"/public/" + "configAxios");
var util = require('util')



router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});
 
router.get("/getdata",function(req,res){

   fromDate=req.query.fromDate;
   toDate=req.query.toDate;

    var formdata ={        
      validation_date_from: fromDate,     
      validation_date_to : toDate,  
      view_name : "bcsm_search_results",
      view_display_id : "notice_search_pane",
      view_path : "bcms/search"
    } ;
   
    request.post({
      url: 'https://www.localgov.ie/en/views/ajax',
      form: formdata
  },
  function (err, httpResponse, body) {
    resObj =   JSON.parse(body);
       
      res.send( resObj[1] );
  });

});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static( (__dirname, 'public')));
app.use("/",router);
 

var port = process.env.PORT || 3900;

app.listen(port,function(){
  console.log("Live at Port "+ port );
});