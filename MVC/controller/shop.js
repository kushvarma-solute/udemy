const Product = require('../model/product');
const Cart = require('../model/cart');



exports.getProduct=(req,res,next)=>{
    // console.log("shop:",productlist.product);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    // Product.fetchAll((product) => {
    //     res.render('shop',{prods:product, pageTitle:'shop',path:'/',hasProduct:product.length > 0,activeShop:true});
    // });   

    Product.fetchAll(products => {
    res.render('./shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  });
};

exports.getProductId = (req,res,next) => {
  const proId = req.params.productId;
  Product.findById(proId,product => {
    console.log(product);
    res.render('./shop/product-detail',{product: product,
      pageTitle:product.title,
    path:'/products'
  });
  });
};

exports.getIndex =(req,res,next)=>{
  Product.fetchAll(products => {
    res.render('./shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getCart = (req,res,next) =>{
  Cart.getCart(cart => {
    Product.fetchAll(products =>{
      const cartProducts = [];
      for(product of products){
        const cartProductData =cart.products.find(prod => prod.id === product.id);
        if (cartProductData){
              cartProducts.push({cartProductData:product,qty:cartProductData.qty});
        }

      }
      res.render('./shop/cart',{
        path:'/cart',
        pageTitle:'Your cart',
        products:cartProducts
      });
    });
});
};

exports.postCart = (req,res,next)=>{
  const proId = req.body.productId;
  Product.findById(proId,product => {
    Cart.addProduct(proId,product.price);
  });
  res.redirect('/cart');

}

exports.postCartDeleteProduct = (req,res,next) => {
  const proId =req.body.productId;
  Product.findById(proId,product=>{
    Cart.delteProduct(proId,product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req,res,next) =>{
  res.render('./shop/orders',{
    path:'/orders',
    pageTitle:'Your Orders'
  });
};

exports.getCheckout = (req,res,next) =>{
  res.render('shop/checkout',{
    path:'/checkout',
    pageTitle:'checkout'
  });
};