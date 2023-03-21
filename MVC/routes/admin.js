const express = require("express");
const path=require('path');
const router= express.Router();
const rootDir=require('../util/path.js')
const adminController=require('../controller/admin')

router.get('/admin/add-product',adminController.getAddProduct);
router.get('/admin/products',adminController.getProduct);
router.post('/admin/add-product',adminController.postAddProduct);
router.get('/admin/edit-product/:productId',adminController.getEditProduct)
router.post('/admin/edit-product',adminController.postEditProduct);
router.post('/admin/delete-product',adminController.postDelteProduct);
module.exports = router;
 