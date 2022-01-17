const { Router } = require('express');
const { validateToken }  = require('../Middlewares/ValidateToken');
const { getAllCategories } = require('../Controller/category_controller');

const router = Router();

router.get('/category/get-all-categories', validateToken,  getAllCategories );

module.exports = router;