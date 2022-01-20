const { response, request } = require('express');
const connet = require('../DataBase/DataBase');

const getAllCategories = async ( req = request, res = response ) => {

    try {

        const conn = await connet();

        const categories = await conn.query('SELECT * FROM Category');

        await conn.end();

        return res.json({
            resp: true,
            message: 'Get all categories',
            categories: categories[0]
        });
        
    } catch (err) {
        return res.status(500).json({
            resp: false,
            message: err
        });
    }

}

module.exports = {
    getAllCategories
}