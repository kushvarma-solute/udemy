const express = require('express');
const bodyParser = require("body-parser");//deprecated
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const error = require('./controller/error');//used to deal with page not found
const User = require('./model/user');
const path = require('path');

const MONGODB_URI='mongodb+srv://kush:kush123@cluster0.w7jn5ey.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
});

const csrfProctection = csrf();
const { listeners } = require('process');

const fileStoreage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'images');
  },
  filename:(req,file,cb)=>{
    const currentDate = new Date().toISOString().slice(0,10);
    cb(null, currentDate +'-'+file.originalname);  }
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg')
  {
      cb(null,true);
  }
  else
  {
      cb(null,false);
  }
}


// app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views','views')
const adminRouter = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const authRouter = require('./routes/auth.js');


app.use(bodyParser.urlencoded({
    extended: false
  }));//it will the request body
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({storage:fileStoreage,fileFilter:fileFilter}).single('image'))


app.use('/images',express.static(path.join(__dirname,'images'))); 

//intialising the session
app.use(session(
    {
      secret:'mysecret',
      resave: false,
      saveUninitialized:false,
      store:store
    })
);

app.use(csrfProctection);
app.use(flash());

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken =req.csrfToken();
  next();
})


app.use((req,res,next) =>{
if(!req.session.user){
  return next();
}
User.findById(req.session.user._id)
.then((user) => {
  if(!user){
    return next();
  }
  req.user=user;
  next();
 }).catch((err) => {
  // console.log(err);
  next( new Error(err));
})
});
 

  
app.use(adminRouter);
app.use(productRouter);
app.use(authRouter);
app.get('/500',error.get500);
app.use(error.get404);

//Error handling Middleware:
app.use((error,req,res,next)=>{
  res.status(500)
  .render('500',
  {
      pageTitle:'Error',
      path:'/500',
      isAuthenticated:req.session
  });
});

mongoose
    .connect(MONGODB_URI)
      .then((result) => {
        // User.findOne().then(user =>{
        //   if(!user){
        //     const user = new User({
        //       name:'kush',
        //       email:'kush@gmail.com',
        //       cart:{
        //         items:[]
        //       }
             
        //     });
        //     user.save();
        //   }
        // })
      
        console.log("connected")
      
        app.listen(3000);
      }).catch((err) => {
        console.log(err)
      });