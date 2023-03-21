const Product = require('../model/product');
// const User = require('../model/user');
exports.getAddProduct=(req,res,next)=>{
    console.log("SECOND middleware");
   // res.sendFile(path.join(rootDir,'views','add-product.html'));
   res.render('./admin/edit-product',
   {
      pageTitle:'Add product',
      path:'/admin/add-product',
      activeAddProduct:true,
       editing : false
    });
}

exports.postAddProduct=(req,res,next)=>{
    const title = req.body.title;
    const imageurl = req.body.imageurl;
    const price = req.body.price;
    const description = req.body.description;
    console.log("image---------------------------:",imageurl);
    //Create create a new element based on that model and immediately save in the databas
    req.user.createProduct({
      title:title,
      price:price,
      imageurl:imageurl,//here on leftside the fields that we define in the product model 
      description:description
    }).then((result) => {
        console.log('Created Product');
        res.redirect('/');  
    }).catch((err) => {
      console.log(err);
    });

    // const product = new Product(null,title,price,imageurl,description);
    // // console.log("reqqq:",req.body); 
    // // console.log("add:",product);
    // product.save().then(()=>{
    //   res.redirect('/');   
    // }).catch(err => console.log(err));
};

exports.getEditProduct=(req,res,next)=>{
 const editMode = req.query.editing;
      if(!editMode)
    {
      res.redirect('/');
    }
    const proId =req.params.productId;
    // Product.findById(proId).then((product) => {
   
      
    // }).catch((err) => {
    //   console.log(err);
    // });
    req.user.getProducts({where:{id:proId}})
    .then(products =>
    // Product.findAll({where : {id:proId}}).then((product) => 
    {
      const product = products[0];
      if(!product)
      {
        return res.redirect('/');
      }
      res.render('./admin/edit-product',
      {
        pageTitle:'edit-product',
        path:'/admin/edit-product',
        editing:editMode,
        product : product
      });
    }).catch((err) => {
        console.log(err);
    });
    // Product.findById(proId, product => {
    //   if(!product)
    //   {
    //     return res.redirect('/');
    //   }
    //   res.render('./admin/edit-product',
    //   {
    //     pageTitle:'edit-product',
    //     path:'/admin/edit-product',
    //     editing:editMode,
    //     product : product
    //   });
    // });
};


exports.postEditProduct = (req,res,next) =>{
  const proId = req.body.productId;
  const UpdatedTitle = req.body.title;
  const UpdatedPrice = req.body.price;
  const UpdatedDesc = req.body.description;
  const Updatedimageurl = req.body.imageurl;
  //As findAll return an array we have bto use the product[0] or else we have to use ffindOne
  Product.findAll({where : {id:proId}})
  .then((product) => {
   product[0].title = UpdatedTitle;
   product[0].price = UpdatedPrice;
   product[0].imageurl = Updatedimageurl;
   product[0].description = UpdatedDesc;
   return product[0].save();
  }).then(result=>{
    console.log('UPDATED PRODUCT');
    res.redirect('/admin/products');
  }).catch((err) => {
      console.log(err);
  });
  // const UpdatedProduct =  new Product(
  //   proid,UpdatedTitle,UpdatedPrice,Updatedimageurl,UpdatedDesc);
  // UpdatedProduct.save();
};


exports.getProduct =(req,res,next)=>{ 
  req.user.getProducts()
  .then(products =>{
  // Product.findAll().then((products) =>
    res.render('./admin/products', {
      prods: products,
      pageTitle: 'Admin product',
      path: '/admin/products',
    });
  }).catch((err) => {
      console.log(err);
  });
  
    // Product.fetchAll(products => {
    //     res.render('./admin/products', {
    //       prods: products,
    //       pageTitle: 'Admin product',
    //       path: '/admin/products',
    //     });
    //   });
};

exports.postDelteProduct = (req,res,next) => {
  const proId = req.body.productId;
  Product.findAll({where : {id:proId}})
  .then((product) => {
    return product[0].destroy(); 
  }).then(result=>{
    console.log('Product Delted');
    res.redirect('/admin/products');
  }).catch((err) => {
    console.log(err);
  });
  // Product.deleteById(proId);
};