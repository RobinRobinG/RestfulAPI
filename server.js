// base setup

// call the packages
// load express module and store it in the variable express
var express = require('express');
// invoke express and store the result in the variable app
var app = express();
// load body parser and store it in the variable bodyParser
var bodyParser = require('body-parser');

// configure app to use body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// create database and connect
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/restfulAPI');

var Cat = require('./app/models/cat');

//set port to 8080
var port = process.env.PORT || 8080;

// routes for API, get an instance of the express router
var router = express.Router();

// create middleware for all requests
router.use(function(req, res, next){
  console.log('Hello! something is happening.');
  next();
});

router.get('/', function(req, res){
  res.json({message: 'hooray! welcome to my api'});
});

router.post('/cats', function(req, res){
    var cat = new Cat();
    cat.name = req.body.name;

    cat.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({message: 'Kitty created!'});
    });
});


router.get('/cats',function(req, res){
    Cat.find(function(err, catdata){
      if(err){
        res.send(err);
      }
      res.json(catdata);
    });
});

router.get('/cats/:cat_id', function(req, res){
  Cat.findById(req.params.cat_id, function(err, catdata){
    if(err){
      res.send(err);
    }
    res.json(catdata);
  });
});

router.put('/cats/:cat_id', function(req, res){
  Cat.findById(req.params.cat_id, function(err, cat){
    if(err){
      res.send(err);
    }
    cat.name = req.body.name;
    cat.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({message:'Cat updated!'});
    });
  });
});

router.delete('/cats/:cat_id', function(req, res){
  Cat.remove({_id:req.params.cat_id}, function(err, cat){
    if(err){
      res.send(err);
    }
    res.json({message: "successfully deleted!", data: cat});
  });
});

// register the routes
// all routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port, function(){
  console.log('Listening on port' + port);
});