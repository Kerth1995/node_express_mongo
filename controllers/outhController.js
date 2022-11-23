const bcrypt = require('bcryptjs/dist/bcrypt');
const {response} = require('express');
const { googleSignInVerify } = require('../helpers/google-vify');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/userDTO');

const login = async (req, res = response)=>{
    const {email, password} = req.body;
    try{
        // validar si existe usuario en la base de datos
        const userExist = await User.findOne({email: email});
        if(!userExist){
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'Email or password invalid.'
            });
        }

        // validar si usuario y password con correctos
        const passwordIsCorrect = await bcrypt.compareSync(password, userExist.password);
        if(!passwordIsCorrect){
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'Email or password invalid.'
            });
        }

        // generar token
        const token = await generateJWT(userExist._id, userExist.email);

        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'Login successful',
            token: token
        });
    }catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error inesperado...'
        });
    }
}

const googleSignIn = async(req, res = response)=>{
    try {
        const tokenGoogle = req.body.token;

        const {email, name, picture} = await googleSignInVerify(tokenGoogle);
        const userDB = await User.findOne({ email: email });
        let user;
        if (!userDB) {
            user = new User({
                email: email,
                name: name,
                password: 'PASS',
                img: picture,
                goole: true
            });
        }else{
            user = userDB;
            user.google = true
        }

        await user.save();

        // generar token
        const token = await generateJWT(user.UUID, user.email);
        /*
        
        
        let user;
        if (!userDB) {
            user = new User({
                email: email,
                name: name,
                password: 'PASS',
                img: picture,
                goole: true
            });
        }else{
            user = userDB;
            user.google = true
        }

        await user.save();

        // generar token
        const token = await generateJWT(user._id, user.email);
        */
        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'Google SignIn successful',
            googleUser: user,
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Token de google no es correcto..'
        });    
    }
}

module.exports = {login, googleSignIn};