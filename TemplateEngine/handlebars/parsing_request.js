const express = require('express');
const path=require("path");
const adminData = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const bodyParser = require("body-parser");//deprecated
const exphbs = require('express-handlebars');//Need to set defaultLayout as false, else "express-handlebars" will search for main.handlebars.
const app = express();

// app.engine('handlebars', exphbs.engine({ defaultLayout: false }));//Need to set defaultLayout as false, else "express-handlebars" will search for main.handlebars.
app.engine('handlebars', exphbs.engine({layoutsDir:'views/layout/',defaultLayout:'main-layout',extname:'handlebars'}));

// app.set('view engine','pug');
app.set('view engine','handlebars');
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