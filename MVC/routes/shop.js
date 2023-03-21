const express = require("express");
const path=require("path");
const shopController=require('../controller/shop')

const router= express.Router();
router.get('/',shopController.getIndex);
router.get('/products',shopController.getProduct);
router.get('/products/:productId',shopController.getProductId);
router.get('/cart',shopController.getCart);
router.post('/cart',shopController.postCart);
router.get('/orders',shopController.getOrders);
router.get('/checkout',shopController.getCheckout);
router.post('/cart-delete-item',shopController.postCartDeleteProduct);

module.exports=router;
