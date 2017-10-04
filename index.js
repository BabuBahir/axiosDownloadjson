var express = require("express");
var app = express();
var router = express.Router();
var axios = require("axios");
var bodyParser = require('body-parser');
var fs = require('fs');
var path = __dirname + '/views/';
var filepath = __dirname + '/downloadtoData.js';

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
    res.sendFile(path + "index.html");
});
 
router.get("/getdata",function(req,res){
    var targetUrl = (req.query.targetUrl);     
    axios.get(targetUrl)
    .then(function(response){   
         res.send(response.data);   
                // fs.writeFile(filepath, response.data[1].body, 'utf8', function (err) {
                //     if (err) {
                //         return console.log(err);
                //     }
                //     res.download(filepath);
                // });                 
    });      
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use("/",router);
 

var port = process.env.PORT || 3900;

app.listen(port,function(){
  console.log("Live at Port "+ port );
});