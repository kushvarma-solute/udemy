const Product = require('../model/product'); 


exports.getProduct=(req,res,next)=>{
  //FindALL will get all the records in sequelize
  Product.fetchAll().then((products) => {
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
  Product.findById(proId)
  .then((product) => {
    res.render('./shop/product-detail',{
        product: product,
        pageTitle:product.title,
        path:'/products'
      });
  }).catch((err) => {
    console.log(err);
  });
  
};

exports.getIndex =(req,res,next)=>{
  //FindALL will get all the records in sequelize
  Product.fetchAll().then((products) => {
    res.render('./shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  }).catch((err) => {
      console.log(err);
  });

  
};

exports.getCart = (req,res,next) =>{
  req.user.getCart()
  .then((products) => {
        res.render('./shop/cart',{
                  path:'/cart',
                  pageTitle:'Your cart',
                  products:products
                });
      })
      .catch((err) => {
          console.log(err);  
      });
  };


  
 

exports.postCart = (req,res,next)=>{
  const proId = req.body.productId;
  Product.findById(proId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  });

}

exports.postCartDeleteProduct = (req,res,next) => {
  const proId =req.body.productId;
  req.user
  .deleteItemFromCart(proId)
  .then((products)=>{
      res.redirect('/cart');
  })
  .catch((err) => {
    console.log(err);
  });
  
};
exports.postOrders =(req,res,next) =>{
   let fetchCart;
  req.user
    .addOrder()
    .then(result=>{
            res.redirect('/orders');
    })   
    .catch((err) => {
     
      console.log(err);
    });
};
exports.getOrders = (req,res,next) =>{
  req.user
  .getOrders1()
  .then(orders=>{
    console.log("orders:",orders)
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