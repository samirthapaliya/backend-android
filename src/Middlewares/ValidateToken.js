const jwt = require('jsonwebtoken');



const validateToken = ( req, res, next ) => {

    let token = req.header('xxx-token');

    if( !token ){
        return res.status(401).json({
            resp: false,
            message : "There is not Token in the request"
        });
    }

    try {

        // -----------------------------------Add key Jwt TOKEN
        const { uidPerson } = jwt.verify( token, process.env.KEY_JWTOKEN );

        req.uidPerson = uidPerson;

        next();
        
    } catch (e) {
        return res.status(401).json({
            resp: false,
            message : 'Invalid Token',
        });
    }

}

module.exports = {
    validateToken
}