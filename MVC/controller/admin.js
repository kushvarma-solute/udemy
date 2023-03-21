const Product = require('../model/product');

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
    console.log(description);
    const product = new Product(null,title,price,imageurl,description);
    // console.log("reqqq:",req.body); 
    // console.log("add:",product);
    product.save();
    res.redirect('/');   
};

exports.getEditProduct=(req,res,next)=>{
 const editMode = req.query.editing;
      if(!editMode)
    {
      res.redirect('/');
    }
    const proId =req.params.productId;
    Product.findById(proId, product => {
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
    });
};


exports.postEditProduct = (req,res,next) =>{
  const proid = req.body.productId;
  const UpdatedTitle = req.body.title;
  const UpdatedPrice = req.body.price;
  const UpdatedDesc = req.body.description;
  const Updatedimageurl = req.body.imageurl;
  const UpdatedProduct =  new Product(
    proid,UpdatedTitle,UpdatedPrice,Updatedimageurl,UpdatedDesc);
  UpdatedProduct.save();
  res.redirect('/admin/products')
};


exports.getProduct =(req,res,next)=>{   
    Product.fetchAll(products => {
        res.render('./admin/products', {
          prods: products,
          pageTitle: 'Admin product',
          path: '/admin/products',
        });
      });
};

exports.postDelteProduct = (req,res,next) => {
  const proId = req.body.productId;
  Product.deleteById(proId);
  res.redirect('/admin/products');
};