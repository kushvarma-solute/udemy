const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  title : Sequelize.STRING,
  price:{
    type: Sequelize.DOUBLE,
    allowNull:false
  },
  imageurl: {
    type: Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }

});
module.exports = Product;





////Using mysql without sequelize:
// const Cart = require('./cart');
//  const db = require('../util/database')

 

// module.exports = class Product {
//   constructor(id,title,price,imageurl,description) {
//     this.id=id;
//     this.title = title;
//     this.price = price;
//     this.imageurl=imageurl;
//     this.description=description;
   
//   }

//   save() {
//     return  db.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)',
//     [this.title,this.price,this.description,this.imageurl])
//   }

//   static deleteById(id){
   
//   }

//   static fetchAll() {
//       return db.execute('SELECT * FROM products')
//       .then(([rows])=> rows);
//    }

//   static findById(id) {
//    return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
//   }

// };


