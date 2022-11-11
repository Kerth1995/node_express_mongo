const {response} = require('express');
const Hospital = require('../models/hospitalDTO');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const getHospital = async (req, res = response) => {
    const hospitals = await Hospital.find()
                                    .populate('user', 'name');
    res.json({
        ok: true,
        msg: 'All hospitals',
        hospitals: hospitals
    });
}

const createHospital = async (req, res = response) => {

    const userUUID = req.uuid;
    const hospital = new Hospital(req.body);
    hospital.user = userUUID;
    
    try{
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            msg: 'Hospital created successful',
            hospital: hospitalDB
        });

    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error creating hospital...'
        });
    }    
}

const updateHospital = async (req, res = response) => {
    res.json({
        ok: true,
        msg: 'put hospistals',
        hospital: 'hospital'
    });
}

const deleteHospital = async (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete hospistals',
        hospital: 'hospital'
    });
}

// busquedas con filtros
const getHospitalByFilters = async (req, res = response) => {
    const filterText = req.params.busqueda;
    const regex = new RegExp(filterText, 'i');
    const hospitals =  await Hospital.find({name: regex});
    res.json({
        ok: true,
        msg: 'get hospitals by filters',
        hospitals: hospitals,
        total: hospitals.length
    });
}

// upload img hospital
const fileUpload = async (req, res = response) => {
    const uuidHospital = req.params.uuid;
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
    const uploadPath = `./uploads/hospitals/${newFileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {
        if (err){
            return res.status(400).json({
                ok: true,
                msg: 'Upload file failed'
            });
        }

        // update user img
        updateImgUser(uuidHospital, newFileName);

        res.json({
            ok: true,
            msg: 'file upload successful',
            uuidHospital: uuidHospital,
            newFileName: newFileName,
            path: uploadPath
        });
    });
}

const updateImgUser = async (uuidHospital, newFileName)=>{
    const hospital = await Hospital.findById(uuidHospital);

    if(!hospital){
        console.log('Hospital not found');
        return false;
    }

    const oldPath = `./uploads/hospitals/${hospital.img}`;

    if(fs.existsSync(oldPath)){
        fs.unlinkSync(oldPath);
    }
    hospital.img = newFileName;
    await hospital.save();
    return true;
}

// download img hospital
const fileDownload = async (req, res = response) => {
    const fileName = req.params.imgName;
    const pathImg = path.join(__dirname, `../uploads/hospitals/${fileName}`);
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathImg);
    }   
}

module.exports = {getHospital
    , createHospital
    , updateHospital
    , deleteHospital
    , getHospitalByFilters
    , fileUpload
    , fileDownload}