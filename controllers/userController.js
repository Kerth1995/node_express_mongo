const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userDTO');
const { generateJWT } = require('../helpers/jwt');
const res = require('express/lib/response');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');


const getUser = async (req, res) => {

    const fromPage = req.query.from || 0;
    const toPage = req.query.to || 8;
    /*
    const user = await User.find({}, 'name email img role google')
                            .skip(fromPage)
                            .limit(toPage);
    const totalUser = await User.count();
    */

    const [users, totalUser] = await Promise.all([
        User.find({}, 'name email img role google')
            .skip(fromPage)
            .limit(toPage),
        User.count()
    ]);

    res.json({
        ok: true,
        msg: 'get users',
        users: users,
        total: totalUser
    });
}

const createUser = async (req, res = response) => {

    const { name, password, email } = req.body;

    try {
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
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
        //generar token
        const token = await generateJWT(user.UUID, user.email);

        // respuesta de guardar
        res.status(200).json({
            ok: true,
            code_state: 200,
            msg: 'User saved successfully',
            user: user,
            token: token
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

    try {
        const userExist = await User.findById(uuid);
        if (!userExist) {
            return res.status(400).json({
                ok: false,
                code_state: 400,
                msg: 'El usuario no existe.'
            });
        }

        const { password, google, email, ...user } = req.body;

        if (userExist.email !== email) {
            const emailExist = await User.findOne({ email: email });
            if (emailExist) {
                return res.status(400).json({
                    ok: false,
                    code_state: 400,
                    msg: 'El correo ya se encuentra registrado.'
                });
            }
        }
        user.email = email;

        const updatedUser = await User.findByIdAndUpdate(uuid, user, { new: true });

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
    try {
        const userExist = await User.findById(uuid);
        if (!userExist) {
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

// busquedas con filtros
const getUserByFilters = async (req, res = response) => {
    const filterText = req.params.busqueda;
    const regex = new RegExp(filterText, 'i');
    const users = await User.find({ name: regex });
    res.json({
        ok: true,
        msg: 'get users by filters',
        user: users,
        total: 16
    });
}

// upload img user
const fileUpload = async (req, res = response) => {
    const uuidUser = req.params.uuid;

    // validar queexista el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: true,
            msg: 'Select one file'
        });
    }

    //procesar file
    const file = req.files.file;
    const fileName = file.name.split('.');
    // obtener extencion del archivo
    const fileExtension = fileName[fileName.length - 1];
    // validar las extenciones permitidas
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!validExtensions.includes(fileExtension)) {
        return res.status(400).json({
            ok: true,
            msg: 'file extension invalid'
        });
    }
    // crear nombre unico de la img para guardar
    const newFileName = `${uuidv4()}.${fileExtension}`;
    // crear path para guardar
    const uploadPath = `./uploads/users/${newFileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {
        if (err){
            return res.status(400).json({
                ok: true,
                msg: 'Upload file failed'
            });
        }

        // update user img
        updateImgUser(uuidUser, newFileName);

        res.json({
            ok: true,
            msg: 'file upload successful',
            uuidUser: uuidUser,
            newFileName: newFileName,
            path: uploadPath
        });
    }); 
}

const updateImgUser = async (uuidUser, newFileName)=>{
    const user = await User.findById(uuidUser);

    if(!user){
        console.log('Medico not found');
        return false;
    }

    const oldPath = `./uploads/users/${user.img}`;

    if(fs.existsSync(oldPath)){
        fs.unlinkSync(oldPath);
    }
    user.img = newFileName;
    await user.save();
    return true;
}

// download img user
const fileDownload = async (req, res = response) => {
    const fileName = req.params.imgName;
    const pathImg = path.join(__dirname, `../uploads/users/${fileName}`);

    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathImg);
    }    
}

module.exports = { getUser
    , createUser
    , updateUser
    , deleteUser
    , getUserByFilters
    , fileUpload
    , fileDownload }