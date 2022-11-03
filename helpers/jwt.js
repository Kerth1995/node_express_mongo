const jwt = require('jsonwebtoken');

const generateJWT = (uuid, email)=>{
    return new Promise((resolve, reject)=>{
        const payload = {
            uuid: uuid,
            email: email,
        }
    
        jwt.sign(payload, process.env.JWT_SECRET_KEY, 
            {
                expiresIn: '12h'
            },
            (err, token) => {
                if(err){
                    console.log(err);
                    reject('No se pudo generar el JWT');
                }else{  
                    resolve(token);
                }
                
            }
        );
    });    
}

module.exports = {generateJWT}