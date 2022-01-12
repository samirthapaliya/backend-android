const jwt = require('jsonwebtoken');



const generarJsonWebToken = ( uidPerson ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uidPerson };

        jwt.sign( payload, process.env.KEY_JWTOKEN, { 
            expiresIn: '24h'
        }, ( err, token ) => {

            if( !err ){ resolve( token ); }
            else { reject( 'No se puedo generar el Token' ); }

        });

    });   
}

module.exports = {
    generarJsonWebToken,
}