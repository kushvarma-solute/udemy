const Product = require('../model/product'); 


exports.getProduct=(req,res,next)=>{
  //FindALL will get all the records in sequelize
  Product.findAll().then((products) => {
    res.render('./shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'       
    });
  }).catch((err) => {
      console.log(err);
  });
  // Product.fetchAll().then((rows) => {
  //   console.log(rows);   
  
  //   res.render('./shop/product-list', {
  //     prods: rows,
  //     pageTitle: 'All Products',
  //     path: '/products'       
  //   });
  //  }).catch((err) =>{
  //    console.log(err);
  //  });

};

exports.getProductId = (req,res,next) => {
  const proId = req.params.productId;
  //In sequelize there No method called FindbyId so we will use findAll
  Product.findAll({where : {id:proId}})
  .then((product) => {
    res.render('./shop/product-detail',{
        product: product[0],
        pageTitle:product[0].title,
        path:'/products'
      });
  }).catch((err) => {
    console.log(err);
  });
  // Product.findById(proId)
  //   .then(([product]) => {
  //   console.log(product[0]);
  //   res.render('./shop/product-detail',{
  //   product: product[0],
  //   pageTitle:product.title,
  //   path:'/products'
  // });
  // }).catch(err => console.log(err));

};

exports.getIndex =(req,res,next)=>{
  //FindALL will get all the records in sequelize
  Product.findAll().then((products) => {
    res.render('./shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  }).catch((err) => {
      console.log(err);
  });

  // Product.fetchAll().then((rows) => {
  //  console.log(rows);   


  // }).catch((err) =>{
  //   console.log(err);
  // });

};

exports.getCart = (req,res,next) =>{
  req.user.getCart()
  .then((cart) => {
      return cart.getProducts()
      .then((products) => {
        res.render('./shop/cart',{
                  path:'/cart',
                  pageTitle:'Your cart',
                  products:products
                });
      }).catch((err) => {
          console.log(err);  
      });
  }).catch((err) => {
    console.log(err);
  });


  //without using sequelize:
//   Cart.getCart(cart => {
//     Product.fetchAll(products =>{
//       const cartProducts = [];
//       for(product of products){
//         const cartProductData =cart.products.find(prod => prod.id === product.id);
//         if (cartProductData){
//               cartProducts.push({cartProductData:product,qty:cartProductData.qty});
//         }

//       }
//       res.render('./shop/cart',{
//         path:'/cart',
//         pageTitle:'Your cart',
//         products:cartProducts
//       });
//     });
// });
};

exports.postCart = (req,res,next)=>{
  const proId = req.body.productId;
  let fetchCart;
  let newQuantity = 1;

  req.user.getCart()
  .then((cart) => {
    fetchCart=cart;
    return cart.getProducts({where: {id: proId}})
  })
  .then(products=>{
    let product;
    if(products.length > 0){
      product = products[0];
    }
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(proId);
  })
  .then((product)=>{
    return fetchCart.addProduct(product,
      {through : {quantity:newQuantity}
    });

  })
  .then(()=>{
    res.redirect('/cart');
  })
  .catch((err) => {
    
  });

  // Product.findById(proId,product => {
  //   Cart.addProduct(proId,product.price);
  // });
  // res.redirect('/cart');

}

exports.postCartDeleteProduct = (req,res,next) => {
  const proId =req.body.productId;
  req.user.getCart()
  .then((cart) => {
    return cart.getProducts({where: {id:proId}});
  }).then((products)=>{
      const product =products[0];
      return product.cartItem.destroy();
  })
  .then((products)=>{
      res.redirect('/cart');
  })
  .catch((err) => {
    console.log(err);
  });
  // Product.findById(proId,product=>{
  //   Cart.delteProduct(proId,product.price);
  //   res.redirect('/cart');
  // });
};
exports.postOrders =(req,res,next) =>{
   let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart=cart;
      return cart.getProducts();
    })
    .then(products=>{
      return req.user
      .createOrder()
      .then((order) => {
        order.addProducts(
            products.map(product =>{
            product.orderItem = {quantity: product.cartItem.quantity};
            return product;
          })
        );
      }).catch((err) => {
        console.log(err);
      });
    }) 
    .then((result)=>{
       //setProduct set the products to Null
      return fetchCart.setProducts(null);
    })
    .then(result=>{
            res.redirect('/orders');
    })   
    .catch((err) => {
     
      console.log(err);
    });
};
exports.getOrders = (req,res,next) =>{
  req.user
  .getOrders({include: ['products']})
  .then(orders=>{
    res.render('./shop/orders',{
      path:'/orders',
      pageTitle:'Your Orders',
      orders:orders
    });
  })
  .catch(err => console.log(err));
};

exports.getCheckout = (req,res,next) =>{
  res.render('shop/checkout',{
    path:'/checkout',
    pageTitle:'checkout'
  });
};