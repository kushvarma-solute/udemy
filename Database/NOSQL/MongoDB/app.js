const express = require('express');
 const adminRouter = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const error = require('./controller/error');//used to deal with page not found
const bodyParser = require("body-parser");//deprecated
const app = express();
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./model/user');
const { listeners } = require('process');
 
// app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views','views')
app.use(bodyParser.urlencoded({
    extended: false
  }));//it will the request body

app.use((req,res,next)=>{
  User.findById('6419b89a181f6832f8b0f529')
  .then((user) => {
    req.user = new User(user.name,user.email,user.cart,user._id);
    next();
  }).catch((err) => {
    console.log(err);
  });
});

app.use(adminRouter);
app.use(productRouter);
app.use(error.get404);

mongoConnect(client => {
  // console.log(client);
  app.listen(3000);
});
