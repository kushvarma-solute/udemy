 const Product = require('../model/product');

 const User = require('../model/user');

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
    const product = new Product
    (
      title,
      price,
      description,
      imageurl,
      null,
      req.user._id
      );
    product
    .save()    
    .then((result) => {
        console.log('Created Product');
        console.log(result);
        res.redirect('/');  
    }).catch((err) => {
      console.log(err);
    });
};

//Admin product page:
exports.getProduct =(req,res,next)=>{ 
  Product.fetchAll()
  .then(products =>{
     res.render('./admin/products', {
      prods: products,
      pageTitle: 'Admin product',
      path: '/admin/products',
    });
  }).catch((err) => {
      console.log(err);
  });
  
}

exports.getEditProduct=(req,res,next)=>{
 const editMode = req.query.editing;
      if(!editMode)
    {
      res.redirect('/');
    }
    const proId =req.params.productId;
  
    Product.findById(proId)
    .then(product  =>
     {
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
    
};


exports.postEditProduct = (req,res,next) =>{
  const proId = req.body.productId;
  const UpdatedTitle = req.body.title;
  const UpdatedPrice = req.body.price;
  const UpdatedDesc = req.body.description;
  const Updatedimageurl = req.body.imageurl;
  
   const product =new Product(
    UpdatedTitle,
    UpdatedPrice,
    UpdatedDesc,
    Updatedimageurl,
    proId
    );
  product.save()
  .then(result=>{
    console.log('UPDATED PRODUCT');
    res.redirect('/admin/products');
  }).catch((err) => {
      console.log(err);
  });
  
};



exports.postDelteProduct = (req,res,next) => {
  const proId = req.body.productId;
  Product.deleteById(proId)  
  .then(result=>{
    console.log('Product Delted');
    res.redirect('/admin/products');
  }).catch((err) => {
    console.log(err);
  });
  // Product.deleteById(proId);
};