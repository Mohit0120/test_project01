const express = require('express');
const router = express.Router();
const passport=require('passport');
const localstrategy=require('passport-local');
const usermodel=require('./users');
const carmodel=require('./product');
const multer=require('multer');
const path=require('path');
passport.use(new localstrategy(usermodel.authenticate()));
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{userin:false});
});

router.post('/reg',function(req,res){
  var data =new  usermodel({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username
  })
  usermodel.register(data,req.body.password)
  .then(function(createduser){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/dashboard');
    })
  })
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/dashboard',
  failureRedirect:'/'
}),function(req,res){});

router.get('/dashboard',isloggedin,function(req,res){
  usermodel.findOne({username:req.session.passport.user})
  .populate('product')
  .then(function(founduser){
    console.log(founduser)
    res.render('dashboard',{founduser,userin:true});
  })
});

router.get('/dashboard', isloggedin, function(req, res){
  res.send(req.body.last_login_date); //last_login_date will not be updated
})



router.get('/product/:no',isloggedin,function(req,res){
  var perPage = 2
  var page = Math.max(0, req.params.no)
  carmodel.find()
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, products) {
        carmodel.count().exec(function(err, count) {
            res.render('product', {
                products,
                page,
                pages: count / perPage,
                userin:true
            })
        })
    })
})

router.get('/logout',function(req,res){
  req.logOut();
  res.redirect('/');
})

function isloggedin(req,res,next)
{
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname))
  }
})

 
var upload = multer({ storage: storage });

router.post('/upload',upload.single('img'),function(req,res){
  usermodel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    founduser.profileimg=`../images/upload/${req.file.filename}`;
    founduser.save(function(){
      res.redirect('/dashboard');
    });
  })
})

router.post('/productinfo',upload.single('productimage'),function(req,res){
  usermodel.findOne({username:req.session.passport.user})
  .then(function(founduser){
    var imgadres=`../images/upload/${req.file.filename}`
    productmodel.create({
      name:req.body.name,
      price:req.body.price,
      description:req.body.description,
      productimage:imgadres,
      userid:founduser
    })
    .then(function(createduser){
      founduser.products.push(createduser)
      founduser.save().then(function(){
        res.redirect('/dashboard');
      })
    })
  })
});



module.exports = router;
