var express = require("express");
var app = express();
var router = express.Router();
var axios = require("axios");
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
    var formdata = configAxios.formdata; //(req.query.fromDate);     
   
    axios.post('https://www.localgov.ie/en/views/ajax', {     

      validation_date_from: "01/10/2017",       
      view_name : "bcsm_search_results",
      view_display_id : "notice_search_pane",
      view_path : "bcms/search"
      
    })
    .then(function(response){    
          console.log( response.data )
       //  res.send( JSON.stringify(response.data[0]) );   
                // fs.writeFile(filepath, response.data[1].body, 'utf8', function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                //     res.download(filepath);
                // });                 
    })
    .catch(function (error) {
      console.log(util.inspect(error, {showHidden: true, depth: null}))
       
      res.send(error);
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