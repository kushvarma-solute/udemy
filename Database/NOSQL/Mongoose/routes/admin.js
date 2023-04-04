const express = require("express");
const path=require('path');
const router= express.Router();
const { check,body } = require('express-validator');
const rootDir=require('../util/path.js')
const isAuth=require('../protected-route/is-auth.js')
const adminController=require('../controller/admin')


router.get('/admin/add-product',isAuth,adminController.getAddProduct);
router.get('/admin/products',isAuth,adminController.getProduct);
router.post('/admin/add-product',[
    body('title')
    .isString()
    .isLength({min:3})
    .trim(),
    
    body('price')
   .isFloat(),

   body('description')
    .isLength({min:5})
    .trim()
],isAuth,adminController.postAddProduct);
router.get('/admin/edit-product/:productId',isAuth,adminController.getEditProduct)
router.post('/admin/edit-product',[
    body('title')
    .isString()
    .isLength({min:3})
    .trim(),
    
    body('price')
   .isFloat(),

   body('description')
    .isLength({min:5})
    .trim()
],isAuth,adminController.postEditProduct);
router.delete('/admin/products/:productId',isAuth,adminController.deleteProduct);
module.exports = router;
 