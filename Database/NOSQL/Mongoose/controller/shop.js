const Product = require('../model/product'); 
const Order = require('../model/order'); 
const fs = require('fs');
const path = require('path');
const PDFDocument =require('pdfkit');
const ITEMS_PER_PAGE= 1;
require('dotenv').config();

const SK="sk_test_51Ms3eCSE6BjtL9A6Ye9ubkCsmFPPU2aNKM9HJQzUTziC9VE08jJexL6zcKRoeM4IV0Sa2gUu5UFLe0dFSCVFJscO00YTFCPk8P"
const stripe =require('stripe')(SK);
exports.getProduct=(req,res,next)=>{
  //Find work differently with mongoose it does give cursor
  //instead it will give us the products then we  could add cursor and call this to get access to the cursor
  
    const page = +req.query.page || 1;//+ will convert oage into integer
  let totalItems;
  Product.find()
  .countDocuments()
  .then(numProducts=>{
    totalItems=numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then((products) => {
    res.render('./shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products',      
      csrfToken:req.csrfToken(),
      currentPage:page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    })
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });
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
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });
  
};

exports.getIndex =(req,res,next)=>{
  const page = +req.query.page || 1;//+ will convert oage into integer
  let totalItems;
  Product.find()
  .countDocuments()
  .then(numProducts=>{
    totalItems=numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
  .then((products) => {
    res.render('./shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      csrfToken:req.csrfToken(),
      currentPage:page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });

  
};

exports.getCart = (req,res,next) =>{
  req.user
  .populate('cart.items.productId')
  .then((user) => {
    const products = user.cart.items;
    console.log("carttttttt",products)
        res.render('./shop/cart',{
                  path:'/cart',
                  pageTitle:'Your cart',
                  products:products,
                });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
  .removeFromCart(proId)
  .then((products)=>{
      res.redirect('/cart');
  })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });
  
}; 

exports.getCheckout = (req,res,next) =>{
  console.log("checkoutttttttttttttt")
  let products;
  let total=0;
  let quantityin=0;
  req.user
  .populate('cart.items.productId')
   .then((user) => {
     products = user.cart.items;
     total=0;
    products.forEach((p) =>{
      total += p.quantity * p.productId.price;
      quantityin=p.quantity;
    });
    console.log('inrender1');  
    //creating session key for the stripe
//  return stripe.checkout.sessions.create({
//       payment_method_types:['card'],
      
//       line_items:products.map(p=>{
//         return{
//           name:p.productId.title,
//           description:p.productId.description,
//           amount : p.productId.price * 100,
//           currency:'usd',
//           quantity:p.quantity
//         };
//       }),
//       success_url: req.protocol + '://' +req.get('host') + '/checkout/success',//hhttp://localhost:3000
//       cancel_url:  req.protocol + '://' +req.get('host') + '/checkout/cancel'
//   });
console.log(quantityin);
return stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: products.map(p => {
  return {
    price_data: {
      currency: 'inr',
      product_data: {
        name: p.productId.title,
        description: p.productId.description
      },
      unit_amount: p.productId.price * 100
    },
    quantity:quantityin
  };
}),
  mode: 'payment',
  success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
  cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
});

 })
  .then(session=>{
    console.log("Session id:",session.id);
      res.render('./shop/checkout',{
      path:'/checkout',
      pageTitle:'Checkout',
      products:products,
      totalSum:total,
      sessionId:session.id
    });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
            });
};


exports.getCheckoutSuccess =(req,res,next) =>{
  req.user
  .populate('cart.items.productId')
  .then((user) => {
    const products = user.cart.items.map(i =>{
      return {quantity:i.quantity,product:{...i.productId._doc}
      };
    });
    const order = new Order({
      user:{
        email:req.user.email,
        userId:req.user
      },
      products:products
    });
   return order.save();
  })
  .then(()=>{
    return req.user.clearCart();
  })
    .then(result=>{
              res.redirect('/orders');
      })   
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        // console.log(err);
      });
};



exports.postOrders =(req,res,next) =>{
  req.user
  .populate('cart.items.productId')
  .then((user) => {
    const products = user.cart.items.map(i =>{
      return {quantity:i.quantity,product:{...i.productId._doc}
      };
    });
    const order = new Order({
      user:{
        email:req.user.email,
        userId:req.user
      },
      products:products
    });
   return order.save();
  })
  .then(()=>{
    return req.user.clearCart();
  })
    .then(result=>{
              res.redirect('/orders');
      })   
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
        // console.log(err);
      });
};

exports.getOrders = (req,res,next) =>{
Order.find({'user.userId':req.user._id})
  .then(orders=>{
    console.log("orders:",orders)
    res.render('./shop/orders',{
      path:'/orders',
      pageTitle:'Your Orders',
      orders:orders
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);    
});
};


exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
  .then((order) => {
    if(!order){
      return next(new Error('No order found'));
    }
    if(order.user.userId.toString() !== req.user._id.toString()){
      return next(new Error("Unauthorized"));
    }
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('data', 'invoices', invoiceName);  
    
    const pdfDoc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
     `inline; filename="${invoiceName}"`);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice',{
      underline:true
    });
    pdfDoc.text('--------------------------------');
    let totalPrice = 0;
    order.products.forEach(prod=>{
      totalPrice +=prod.quantity * prod.product.price
      pdfDoc.text(
        prod.product.title +
        '-' + 
        prod.quantity +
        'x' +
        'Rs' +
        prod.product.price
      );
    });
    pdfDoc.text('Total Price: Rs.' + totalPrice);
    pdfDoc.end();
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     // Handle the error
    //     console.log(err);
    //     return res.status(500).send({ error: 'Unable to load PDF document' });
    //   }
    //   console.log(data);
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
    //   res.send(data);
    // });

    //It will rread data step by step:
    // const file = fs.createReadStream(invoicePath);
  
    //  file.pipe(res); 

  }).catch((err) => {
    next(err);
  });

};
