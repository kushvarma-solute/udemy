const express = require("express");
const path=require('path');
const router= express.Router();
const rootDir=require('../util/path.js')
const product=[];

router.get('/productdetail',(req,res,next)=>{
    console.log("SECOND middleware");
   // res.sendFile(path.join(rootDir,'views','add-product.html'));
   res.render('add-product',{pageTitle:'Add product',path:'/productdetail'});
});

router.post('/productdetail',(req,res,next)=>{
    product.push({title:req.body.title})
    console.log("reqqq:",req.body); 
    console.log("add:",product);
    res.redirect('/');   
});
exports.routes=router;
exports.product=product;