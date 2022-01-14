
const {response, request} = require('express');
const connet = require('../DataBase/DataBase');
const bcrypt = require('bcrypt');
const { generarJsonWebToken } = require('../Helpers/JWToken');


const LoginUsuario = async ( req = request, res = response ) => {

    const { email, passwordd } = req.body;

   try {

        const conn = await connet();

        const existsEmail = await conn.query('SELECT id, email, passwordd FROM users WHERE email = ? LIMIT 1', [ email ]);


        if( existsEmail[0].length === 0 ){
            conn.end();
            return res.status(400).json({
                resp: false,
                message : 'Wrong Credentials'
            });
        }


        const validatedPassword = await bcrypt.compareSync( passwordd, existsEmail[0][0].passwordd );

        if( !validatedPassword ){

            conn.end();
            return res.status(400).json({
                resp: false,
                message: 'Wrong Credentials'
            }); 
            
        }

        const token = await generarJsonWebToken( existsEmail[0][0].id );
                
        conn.end();
        return res.json({
            resp: true,
            message : 'Welcome to Frave Shop',
            token: token
        });

        

   } catch (err) {
        return res.status(500).json({
            resp: false,
            message : err
        });
   }
}

const RenweToken = async ( req = request , res = response ) => {


    const token = await generarJsonWebToken( req.uidPerson );
   
    return res.json({
        resp: true,
        message : 'Welcome to Frave Shop',
        token: token
    });
}


module.exports = {
    LoginUsuario,
    RenweToken,
};