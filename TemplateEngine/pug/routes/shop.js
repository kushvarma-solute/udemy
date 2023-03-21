const express = require("express");
const rootDir=require('../util/path.js');
const productlist=require('./admin');
const path=require("path");
const router= express.Router();
router.get('/',(req,res,next)=>{
    // console.log("shop:",productlist.product);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const product =productlist.product;
    res.render('shop',{prods:product, pageTitle:'shop',path:'/'});
});
module.exports=router;
