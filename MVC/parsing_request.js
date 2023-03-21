const express = require('express');
const path=require("path");
const adminRouter = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const error = require('./controller/error');
const bodyParser = require("body-parser");//deprecated
 const app = express();

  
// app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views','views')
app.use(bodyParser.urlencoded({
    extended: false
  }));//it will the request body

app.use(adminRouter);
app.use(productRouter);
app.use(error.get404);
 



app.listen(3000);