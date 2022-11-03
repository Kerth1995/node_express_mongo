const {response} = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/userDTO');


const getUser = async (req, res) => {

    const user = await User.find({}, 'name email img role google');
    res.json({
        ok: true,
        msg: 'get users',
        users: user
    });
}

const createUser = async (req, res = response) => {

    const {name, password, email} = req.body;    

    try{        
        const emailExist = await User.findOne({email: email});
        if(emailExist){
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'El correo ya se encuentra registrado.'
            });
        }
        const user = new User(req.body);
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await user.save();

        // respuesta de guardar
        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'User saved successfully',
            user: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error inesperado...'
        });
    }

    
}

const updateUser = async (req, res = response) => {

    const uuid = req.params.uuid;

    try{        
        const userExist = await User.findById(uuid);
        if(!userExist){
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'El usuario no existe.'
            });
        }

        const {password, google, email, ...user} = req.body;

        if(userExist.email !== email){
            const emailExist = await User.findOne({email: email});
            if(emailExist){
                return res.status(400).json({
                    ok: false,
                    code_state: 400,
                    msg: 'El correo ya se encuentra registrado.'
                });
            }
        }
        user.email =  email;

        const updatedUser = await User.findByIdAndUpdate(uuid, user, {new: true});
        
        // respuesta de guardar
        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'User updated successfully',
            updated_User: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error inesperado...'
        });
    }

    
}

const deleteUser = async (req, res = response) => {
    const uuid = req.params.uuid;
    try{
        const userExist = await User.findById(uuid);
        if(!userExist){
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'El usuario no existe.'
            });
        }
        
        const result = await User.findByIdAndDelete(uuid)
        // respuesta de eliminar
        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'User updated successfully',
            updated_Deleted: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error inesperado...'
        });
    }
}

module.exports = {getUser, createUser, updateUser, deleteUser}