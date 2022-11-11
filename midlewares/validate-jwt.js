const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next)=>{
    const token = req.header('token');
    if(!token){
        return res.status(401).json({
            ok: false,
            code_state: 401,
            msg: 'Invalid token.'
        });
    }

    try {
        const {uuid} = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.uuid = uuid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            code_state: 401,
            msg: 'Invalid token.'
        });
    }

    
}

module.exports = {validateJWT}