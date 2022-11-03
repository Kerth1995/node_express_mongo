const bcrypt = require('bcryptjs/dist/bcrypt');
const {response} = require('express');
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

module.exports = {login};