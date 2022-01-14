const { Router } = require('express');
const { LoginUsuario, RenweToken } = require('../Controller/LoginController');
const { validateToken } = require('../Middlewares/ValidateToken');

const router = Router();

    router.post('/auth/login', LoginUsuario);
    router.get('/auth/renew-login', validateToken ,RenweToken );


module.exports = router;