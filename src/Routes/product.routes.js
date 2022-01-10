const { Router } = require('express');
const { getProductsForHomeCarousel,
    getListProductsHome, 
    likeOrUnlikeProduct, 
    getAllListCategories,
    productFavoriteForUser,
    getProductsForCategories,
    saveOrderBuyProducts,
    addNewProduct,
    getAllPurchasedProducts,
    getOrderDetailsProducts } = require('../Controller/ProductController');
const { validateToken }  = require('../Middlewares/ValidateToken');
const { uploadsProduct } = require('../Helpers/Multer');

const router = Router();

    router.get('/product/get-home-products-carousel', validateToken,  getProductsForHomeCarousel );
    router.get('/product/get-products-home', validateToken, getListProductsHome);
    router.post('/product/like-or-unlike-product', validateToken, likeOrUnlikeProduct);
    router.get('/product/get-all-categories', validateToken, getAllListCategories);
    router.get('/product/get-all-favorite', validateToken, productFavoriteForUser);
    router.get('/product/get-products-for-category/:idCategory', validateToken, getProductsForCategories);
    router.post('/product/save-order-buy-product', validateToken, saveOrderBuyProducts);
    router.post('/product/add-new-product', [validateToken, uploadsProduct.single('productImage')], addNewProduct);
    router.get('/product/get-all-purchased-products', validateToken, getAllPurchasedProducts);
    router.get('/product/get-orders-details/:uidOrder', validateToken, getOrderDetailsProducts);

module.exports = router;