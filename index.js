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
var util = require('util');
var cheerio = require('cheerio');
var moment = require('moment');
 

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});
 
router.get("/getdata",function(req,res){

   var fromDate=req.query.fromDate;
   fromDate = moment(fromDate).format('DD/MM/YYYY');
   var toDate=req.query.toDate;
   toDate = moment(toDate).format('DD/MM/YYYY');

  var resultCount ="";     
   
  var Vurl = 'https://www.localgov.ie/en/bcms/search?search_api_views_fulltext='
  +'&validation_date_from[date]='+fromDate+'&validation_date_to[date]='+toDate
  +'&page=0';

  console.log(Vurl);
      request(Vurl, function (error, response, body) {     
        let $ = cheerio.load(  body );
        
          res.send(Vurl);
      });
});

 
router.get("/callNodeUrl" ,function(req,res){
  var nodeUrl = req.query.nodeUrl;
  var Vurl = 'https://www.localgov.ie'+nodeUrl;
  console.log( req.query.nodeUrl); 
 
      request(Vurl, function (error, response, body) {     
        let $ = cheerio.load(  body );
        var sectionArr = [];
              
              $("section.notice-info").each(function(i,item) {
                var sectionHtml = $(this).html() ;
                sectionArr.push(sectionHtml);                  
              });

              $(".field-name-field-cc-no").each(function(){
                var sectionHtml = $(this).html() ;                 
                sectionArr.push(sectionHtml);                  
              });

          res.send(sectionArr);
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