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
 
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});
 
router.get("/getdata",function(req,res){

   var fromDate=req.query.fromDate;
   var toDate=req.query.toDate;
   var resultCount ="";

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
        if(err) console.log(err);

        resObj =   JSON.parse(body);
        let $ = cheerio.load(  resObj[1].data );
      
          $(".view-header").each(function() {
              var headerhtml = $(this).html() ;
              var resultCount =(  headerhtml.split("results")[0]   ).trim();
              listTop10ItemsJSON =  listTop10Items(resultCount) ;      
              res.send( listTop10ItemsJSON);
          });

          function listTop10Items(resultCount){
                var listTop10ItemsJSON = [];
                
                if(resultCount >= 10){
                      $('a').each(function(i, element){                       
                        listTop10ItemsJSON.push(  $(this).attr('href')  );
                        if(i==9){
                          return false;    //break foreach
                        }

                    });
                }               
              return JSON.stringify(listTop10ItemsJSON);
          }
      
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