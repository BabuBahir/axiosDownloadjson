var express = require("express");
var app = express();
var router = express.Router();
var axios = require("axios");
var request = require("request");
var rp = require('request-promise');
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
  var sectionArr = [];
  var iterration = 0;  //pagination index
  var maxIterration = 0;
  var shouldContinue = true;

  var Vurl = 'https://www.localgov.ie/en/bcms/search?search_api_views_fulltext='
  +'&validation_date_from[date]='+fromDate+'&validation_date_to[date]='+toDate
  +'&page=';

for(var iterration = 0 ; iterration < 20 ; iterration ++){
       var url = Vurl + iterration;
       var ctr = 0;
        
       var options = {
          uri: url,
          transform: function (body) {
            return cheerio.load(body);
            }
        };

        rp(options)
        .then(function ($) {
             
              maxIterration = $("div.view-header").html().split("results")[0].trim() ;
           
                  $("li.views-row").each(function(i,item) {                   
                    ctr=ctr+1;   
                    AppendHtml( $(this).html() , ctr , maxIterration );                                                            
              });   

        })
        .catch(function (err) {
              console.log(err); // Crawling failed or Cheerio choked...
        });              

    } // for loop ends
     
    function AppendHtml(item , ctr , maxIterration) {

      // DOM manipulations -- start
      var $ = cheerio.load(item);     
      $("div.search-results-header").prepend("<span onclick='onDivFocus(this)' class='badge'>"+ctr+"</span>");       
      $("div.search-results-header").prepend("<script> function onDivFocus(item){console.log( $(item).parent() )} </script>")
      
       var currentHREF = $("a").attr("href");
        $("a").attr("href" , '#' + currentHREF) ;
        $("a").append("<hr/>");
        
       //  DOM manipulations -- End

        sectionArr.push(  $.html()  );                 
  
        if(ctr == maxIterration){
            res.json({ sectionArr: sectionArr , totalRecords : ctr });                               
        }
    }        
     
});

 
router.get("/node/:ID" ,function(req,res){
  var ID = req.params.ID;
  var Vurl = 'https://www.localgov.ie/node/'+ID;   

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