const express = require("express");
const path=require("path");
const shopController= require('../controller/shop')
const isAuth=require('../protected-route/is-auth')
const router= express.Router();
router.get('/',shopController.getIndex);
router.get('/products',shopController.getProduct);
router.get('/products/:productId',shopController.getProductId);
router.get('/cart',isAuth,shopController.getCart);
router.post('/cart',isAuth,shopController.postCart);

router.get('/checkout',isAuth,shopController.getCheckout);
router.get('/checkout/success',isAuth,shopController.getCheckoutSuccess);
router.get('/checkout/cancel',isAuth,shopController.getCheckout);

router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct);
router.post('/create-order',isAuth,shopController.postOrders);
router.get('/orders',isAuth,shopController.getOrders);
router.get('/orders/:orderId',isAuth,shopController.getInvoice);

module.exports=router;
