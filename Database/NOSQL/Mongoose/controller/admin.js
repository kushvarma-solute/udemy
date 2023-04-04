 const Product = require('../model/product');
const mongoose = require('mongoose')
const fileHelper = require('../util/file');
const user = require('../model/user');
 const { validationResult } = require('express-validator');




exports.getAddProduct=(req,res,next)=>{
    // if(!req.session.isLoggedIn){
    //   return res.redirect('/login');
    // }
    console.log("SECOND middleware");
   // res.sendFile(path.join(rootDir,'views','add-product.html'));
   res.render('./admin/edit-product',
   {
      pageTitle:'Add product',
      path:'/admin/add-product',
      // activeAddProduct:true,
      editing : false,
      hasError:false,
      errorMessage:null,
      validationErrors:[]
    });
}

exports.postAddProduct=(req,res,next)=>{
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    console.log("image------------------------------------------------------------------------------:",image);
    if(!image){
      return res.status(422).render('./admin/edit-product',
         {
           pageTitle:'Add-product',
           path:'/admin/edit-product',
           editing:false,
           hasError:true,
           product : {
             title:title,
              price:price,
             description:description
           },
           errorMessage:'Attached file is not an image',
           validationErrors:[]
         });
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('./admin/edit-product',
         {
           pageTitle:'Add-product',
           path:'/admin/edit-product',
           editing:false,
           hasError:true,
           product : {
             title:title,
             imageurl:imageurl,
             price:price,
             description:description
           },
           errorMessage:errors.array()[0].msg,
           validationErrors:errors.array()
         });  
      }
      const imageurl = image.path;
    const product = new Product
    ({
        // _id: new mongoose.Types.ObjectId('642285d6e39dd0ea9a238454'),
        title:title,
        price:price,
        description:description,
        imageurl:imageurl,
        userId: req.user
});
    product
    .save()    
    .then((result) => {
        console.log('Created Product');
        console.log(result);
        res.redirect('/');  
    }).catch((err) => {
      // return res.status(500).render('./admin/edit-product',
      // {
      //   pageTitle:'Add-product',
      //   path:'/admin/add-product',
      //   editing:false,
      //   hasError:true,
      //   product : {
      //     title:title,
      //     imageurl:imageurl,
      //     price:price,
      //     description:description
      //   },
      //   errorMessage:'Database operation failed please try again',
      //   validationErrors:[]
      // });
      // res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

//Admin product page:
exports.getProduct =(req,res,next)=>{ 
  Product.find({userId:req.user._id})
  // .select('title price -_id')
  // .populate('userId','name')
  .then(products =>{
    console.log(products);
     res.render('./admin/products', {
      prods: products,
      pageTitle: 'Admin product',
      path: '/admin/products',
     });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });
  
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
        hasError:false,
        product : product,
        errorMessage:null,
        validationErrors:[]

      });
    }).catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);    });
    
};


exports.postEditProduct = (req,res,next) =>{
  const proId = req.body.productId;
  const UpdatedTitle = req.body.title;
  const UpdatedPrice = req.body.price;
  const UpdatedDesc = req.body.description;
  const image = req.file;
  const errors = validationResult(req);
console.log("imageedit----------------------------------",image)
  if(!image){
    return res.status(422).render('/admin/edit-product',
       {
         pageTitle:'Add-product',
         path:'/admin/edit-product',
         editing:false,
         hasError:true,
         product : {
           title:title,
            price:price,
           description:description
         },
         errorMessage:'Attached file is not an image',
         validationErrors:[]
       });
  }
  if(!errors.isEmpty()){
      return res.status(422).render('./admin/edit-product',
       {
         pageTitle:'Edit-product',
         path:'/admin/edit-product',
         editing:true,
         hasError:true,
         product : {
           title:UpdatedTitle,
           price:UpdatedPrice,
           description:UpdatedDesc,
           _id:proId
         },
         errorMessage:errors.array()[0].msg,
         validationErrors:errors.array()
       });  
    }
   Product.findById(proId)
   .then(product =>{
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/');
    }
      product.title = UpdatedTitle;
      product.price = UpdatedPrice;
      product.description = UpdatedDesc;
      if(image){
              fileHelper.deleteFile(product.imageurl);
              product.imageurl = image.path;
      }
      return product
      .save()
      .then(result=>{
        console.log('UPDATED PRODUCT');
        res.redirect('/admin/products');
      });
   })
  .catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);  });
  
};



exports.deleteProduct = (req,res,next) => {
  const proId = req.params.productId;
  Product.findById(proId)
  .then((product) => {
    if(!product){
      return next(new Error('Product not Found'));
    }
    fileHelper.deleteFile(product.imageurl);
    return Product.deleteOne({_id:proId,userId:req.user._id})  //built in method ton remove document

  }).then(result=>{
    console.log('Product Deleted');
    res.status(200).json({message:'Success!'});
  }).catch((err) => {
   res.status(500).json({message:'Deleting Product failed'});

  }) ;
 };