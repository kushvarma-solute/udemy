const express = require('express');
const path=require("path");
const adminRouter = require('./routes/admin.js');
const productRouter = require('./routes/shop.js');
const error = require('./controller/error');
const bodyParser = require("body-parser");//deprecated
const app = express();
const sequelize = require('./util/database.js');
const Product = require('./model/product');
const User = require('./model/user');
const Cart = require('./model/cart');
const CartItem = require('./model/cart-item');
const Order = require('./model/order');
const OrderItem = require('./model/order-item');
const { listeners } = require('process');
 
// app.set('view engine','pug');
app.set('view engine','ejs');
app.set('views','views')
app.use(bodyParser.urlencoded({
    extended: false
  }));//it will the request body

app.use((req,res,next)=>{
  User.findByPk(1)
  .then((user) => {
    req.user = user;
    next();
  }).catch((err) => {
    console.log(err);
  });
});
app.use(adminRouter);
app.use(productRouter);
app.use(error.get404);


//Associations:
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'}); 
User.hasMany(Product);
User.hasOne(Cart);

Cart.belongsTo(User);
Cart.belongsToMany(Product,{through : CartItem});
Product.belongsToMany(Cart,{through : CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{ through:OrderItem });
//Sync :sync our model to the Database by creating appropriate tables and if they exist then relations
//sync({force : true})
// The force: true option will drop any existing tables in the database and recreate them from scratch
sequelize
.sync()
//.sync({force : true})
.then(result => {
  return User.findByPk(1);
}).then(user =>{
  if(!user){
    return User.create({name:'kush',email:'kush@gmail.com'});
  }
  return user;
})
.then(user =>{
  //console.log(user);
  return user.createCart();
})
.then(cart =>{
  app.listen(3000);
})
.catch(err => {
  console.log(err);
})

