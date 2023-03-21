const express = require('express');
const path=require("path");
const adminData = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const bodyParser = require("body-parser");//deprecated
 const app = express();

  
// app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views','views')
app.use(bodyParser.urlencoded({
    extended: false
  }));//it will the request body

app.use(adminData.routes);
app.use(productRouter);
app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'Page Not found'});
});
 



app.listen(3000);