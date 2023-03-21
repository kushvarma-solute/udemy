const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const CartItem = sequelize.define('cart',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
});
module.exports = CartItem;





//without using sequelize
// const fs = require('fs');
// const path = require('path');

// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   'data',
//   'cart.json'
// );

// module.exports= class Cart{
//     // ..fetch the previous cart
//     static addProduct(id,productPrice){
//     fs.readFile(p, (err,filecontent) => {
//         let cart = {products:[] , totalPrice: 0};
//         if(!err){
//             cart = JSON.parse(filecontent);
//         }
//         //Adding new product or increasing quantity:
//         const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
//         const existingProduct=cart.products[existingProductIndex];
//         let updatedProduct;
//         if(existingProduct){
//             updatedProduct={ ...existingProduct };
//             updatedProduct.qty = updatedProduct.qty + 1;
//             cart.products = [...cart.products];
//             cart.products[existingProductIndex]=updatedProduct;

//         }
//         else
//         {
//             updatedProduct = {id:id , qty:1};
//             cart.products = [...cart.products,updatedProduct];
//         }
//         cart.totalPrice = cart.totalPrice + +productPrice;
//         fs.writeFile(p, JSON.stringify(cart),err => {
//             console.log(err);
//         })
//     });
// }

//     static delteProduct(id,productPrice){
//         fs.readFile(p,(err,fileContent)=>{
//             if(err){
//                 return;
//             }
//             const updateCart = {...JSON.parse(fileContent)};
//             const product= updateCart.products.find(prod => prod.id === id);
//             if (!product){
//                 return;
//             }
//             const productQty = product.qty;
//             updateCart.products = updateCart.products.filter(prod => prod.id !== id);
//             updateCart.totalPrice=updateCart.totalPrice - productPrice * productQty; 
            
//             fs.writeFile(p, JSON.stringify(updateCart),err => {
//                 console.log(err);
//             });
//         });
//     }

//     static getCart(cb) {
//         fs.readFile(p, (err, fileContent) => {
//           const cart = JSON.parse(fileContent);
//           if (err) {
//             cb(null);
//           } else {
//             cb(cart);
//           }
//         });
//       }
// };
    
 