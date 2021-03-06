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
var configAxios = require(__dirname + "/public/" + "configAxios");
var util = require('util');
var cheerio = require('cheerio');
var moment = require('moment');
var xray = require('x-ray');
var x = xray(); 
const makeDriver = require('request-x-ray');
var  forEachAsync = require('foreachasync').forEachAsync;
const DownloadfilePath = __dirname + '\\'+ 'public'+ '\\' + "results.txt";

const options = {
	method: "GET", 						//Set HTTP method
	jar: true, 							//Enable cookies
	headers: {							//Set headers
		"User-Agent": "Firefox/48.0"
	}
};

const driver = makeDriver(options);		//Create driver

x.driver(driver);


router.use(function (req, res, next) {
  next();
});

router.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

router.get("/getdata", function (req, res) {

      var fromDate = req.query.fromDate;
      fromDate = moment(fromDate).format('DD/MM/YYYY');
      var toDate = req.query.toDate;
      toDate = moment(toDate).format('DD/MM/YYYY');
      var ctr = 0;  
      var nodeArr = [];
      var itteration = 0;
      

      var Vurl = 'https://www.localgov.ie/en/bcms/search?search_api_views_fulltext=' +
        '&validation_date_from[date]=' + fromDate + '&validation_date_to[date]=' + toDate ;         
       
                          
        console.log(Vurl);
         
         fs.unlinkSync(DownloadfilePath);  // clear previous contetn

  x(Vurl, 'li.views-row', [{
          link: 'a@href',
          
        }]).paginate('.pager-next > a@href').limit(100) 
          (function(err, obj) {
            if(err || !obj) {
              console.log('An exception occured.')
              //callback(err);
              return;
            }             
            
            forEachAsync(obj , function(next , item) {
                 
                x(item.link, 'body@html' )(function(err, body) {
                     var $ = cheerio.load(body);   
 
                      $("div.field-item").each(function(i,section) {
                            var sectionHtml = $(this).html() ;                            
                            fs.appendFileSync(DownloadfilePath, sectionHtml);
                            
                      });
                      fs.appendFileSync(DownloadfilePath, "\r\n"); 
                      next();
                });
 
            }).then(function() {
           
               res.send (obj);                   
            }); 
             
            callback(null, obj);
                              
          });
    
  });
  

router.get("/node/:ID", function (req, res) {
      var ID = req.params.ID;
      var Vurl = 'https://www.localgov.ie/node/' + ID;

      request(Vurl, function (error, response, body) {
        let $ = cheerio.load(body);
        var sectionArr = [];


        $("section.notice-info").each(function (i, item) {
          var sectionHtml = $(this).html();
          sectionArr.push(sectionHtml);
        });

        $(".field-name-field-cc-no").each(function () {
          var sectionHtml = $(this).html();
          sectionArr.push(sectionHtml);
        });

        res.send(sectionArr);
      });
    });

    app.use(bodyParser.urlencoded({
      extended: false
    })); app.use(bodyParser.json()); app.use(express.static((__dirname, 'public'))); app.use("/", router);


    var port = process.env.PORT || 3900;

    app.listen(port, function () {
      console.log("Live at Port " + port);
    });