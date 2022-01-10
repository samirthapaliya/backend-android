const { response, request } = require('express');
const connet = require('../DataBase/DataBase');



const getProductsForHomeCarousel = async ( req = request, res = response ) => {

    try {

        const conn = await connet();

        const rows = await conn.query('SELECT * FROM Home_carousel');

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get List products home',
            slideProducts: rows[0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const getListProductsHome = async (req = request, res = response) => {

    try {

        const conn = await connet();

        const products = await conn.query(`CALL SP_LIST_PRODUCTS_HOME(?);`,[ req.uidPerson ]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get List Products for Home',
            listProducts: products[0][0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

const likeOrUnlikeProduct = async (req = request, res = response) => {

    try {

        const { uidProduct } = req.body;

        const conn = await connet();

        const isLike = await conn.query('SELECT COUNT(uidFavorite) isfavorite FROM favorite WHERE user_id = ? AND product_id = ?', [ req.uidPerson, uidProduct ]);

        if( isLike[0][0].isfavorite > 0 ){

            await conn.query('DELETE FROM favorite WHERE user_id = ? AND product_id = ?', [ req.uidPerson, uidProduct ]);

            await conn.end();

            return res.json({
                resp: true,
                message: 'Unlike'
            });
        }

        await conn.query('INSERT INTO favorite (user_id, product_id) VALUE (?,?)', [ req.uidPerson, uidProduct ]);

        await conn.end();

        return res.json({
            resp: true,
            message: 'Like'
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const getAllListCategories = async (req = request, res = response) => {

    try {

        const conn = await connet();

        const category = await conn.query('SELECT * FROM Category');

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get All List Categories',
            categories: category[0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const productFavoriteForUser = async (req = request, res = response) => {

    try {

        const conn = await connet();

        const listProducts = await conn.query(`CALL SP_LIST_FAVORITE_PRODUCTS(?);`, [ req.uidPerson ]);

        await conn.end();

        res.json({
            resp: true,
            message : 'List to products favorites',
            listProducts: listProducts[0][0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

const getProductsForCategories = async (req = request, res = response) => {

    try {

        const conn = await connet();

        const products = await conn.query(`CALL SP_LIST_PRODUCTS_FOR_CATEGORY(?,?);`, [ req.params.idCategory, req.uidPerson ]); 

        await conn.end();

        res.json({
            resp: true,
            message : 'List Products',
            listProducts: products[0][0] 
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

const saveOrderBuyProducts = async (req = request, res = response) => {

   try {
       
    const { receipt, amount, products  } = req.body;

    const conn = await connet();
 
    const db = await conn.query('INSERT INTO orderBuy (user_id, receipt, amount) VALUES (?,?,?)', [ req.uidPerson, receipt, amount ]);

    products.forEach(e => {
        conn.query('INSERT INTO orderDetails (orderBuy_id, product_id, quantity, price) VALUES (?,?,?,?)', [db[0].insertId, e.uidProduct, e.amount, e.price]);
    });

    // await conn.end();

    return res.json({
        resp: true,
        message: 'Products save'
    });


   } catch (err) {
    return res.status(500).json({
        resp: false,
        message: err
    });
   }
}

const addNewProduct = async (req = request, res = response) => {

    try {

        const { name, description, stock, price, uidCategory } = req.body;

        const conn = await connet();

        await conn.query('INSERT INTO Products (nameProduct, description, codeProduct, stock, price, picture, category_id) VALUE (?,?,?,?,?,?,?)', 
            [ name, description, '000' + name, stock, price, req.file.filename, uidCategory ]);

        await conn.end();   

        return res.json({
            resp: true,
            message: 'Product Added'
        })
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }
}

const getAllPurchasedProducts = async ( req, res = response ) => {

    try {

        const conn = await connet();

        const orderbuy = await conn.query('SELECT * FROM orderBuy WHERE user_id = ?', [req.uidPerson]);

        await conn.end();

        res.json({
            resp: true,
            msg : 'Get Puchased Products',
            orderBuy : orderbuy[0],
        });
        
    } catch (err) {
        
    }
   
}

const getOrderDetailsProducts = async ( req, res = response ) => {

    try {

        const conn = await connet();

        const orderDetails = await conn.query(`CALL SP_ORDER_DETAILS(?);`, [req.params.uidOrder]);

        await conn.end();

        res.json({
            resp: true,
            msg : 'Get Puchased Products',
            orderDetails : orderDetails[0][0],
        });
        
    } catch (err) {
        
    }
   
}



module.exports = {
    getProductsForHomeCarousel,
    getListProductsHome,
    likeOrUnlikeProduct,
    getAllListCategories,
    productFavoriteForUser,
    saveOrderBuyProducts,
    getProductsForCategories,
    addNewProduct,
    getAllPurchasedProducts,
    getOrderDetailsProducts
}