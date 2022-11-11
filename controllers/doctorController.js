const {response} = require('express');
const Doctor = require('../models/doctorDTO');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const getDoctor = async (req, res = response) => {
    const doctors = await Doctor.find()
                                .populate('user', 'name')
                                .populate('hospital', 'name');
    res.json({
        ok: true,
        msg: 'All doctors',
        doctors: doctors
    });
}

const createDoctor = async (req, res = response) => {
    let doctor = new Doctor(req.body);
    doctor.user = req.uuid;
    try {
        const doctorDB = await doctor.save();

        res.json({
            ok: true,
            msg: 'Doctor created successful',
            doctor: doctor
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            code_state: 500,
            msg: 'Error creating doctor...'
        });
    }
}

const updateDoctor = async (req, res = response) => {
    res.json({
        ok: true,
        msg: 'put Doctor',
        hospital: 'Doctor'
    });
}

const deleteDoctor = async (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete Doctor',
        hospital: 'Doctor'
    });
}

// busquedas con filtros
const getDoctorByFilters = async (req, res = response) => {
    const filterText = req.params.busqueda;
    const regex = new RegExp(filterText, 'i');
    const doctors =  await Doctor.find({name: regex});
    res.json({
        ok: true,
        msg: 'get hospitals by filters',
        doctors: doctors,
        total: doctors.length
    });
}

// upload img doctor
const fileUpload = async (req, res = response) => {
    const uuidDoctor = req.params.uuid;
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
    const uploadPath = `./uploads/doctors/${newFileName}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function (err) {
        if (err){
            return res.status(400).json({
                ok: true,
                msg: 'Upload file failed'
            });
        }

        // update user img
        updateImgUser(uuidDoctor, newFileName);

        res.json({
            ok: true,
            msg: 'file upload successful',
            uuidDoctor: uuidDoctor,
            newFileName: newFileName,
            path: uploadPath
        });
    });
}

const updateImgUser = async (uuidDoctor, newFileName)=>{
    const doctor = await Doctor.findById(uuidDoctor);

    if(!doctor){
        console.log('Doctor not found');
        return false;
    }

    const oldPath = `./uploads/doctors/${doctor.img}`;

    if(fs.existsSync(oldPath)){
        fs.unlinkSync(oldPath);
    }
    doctor.img = newFileName;
    await doctor.save();
    return true;
}

// download img doctor
const fileDownload = async (req, res = response) => {
    const fileName = req.params.imgName;
    const pathImg = path.join(__dirname, `../uploads/doctors/${fileName}`);
    console.log('pathImg fileDownload ', pathImg);
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-image.jpg`);
        res.sendFile(pathImg);
    }   
}

module.exports = {getDoctor
    , createDoctor
    , updateDoctor
    , deleteDoctor
    , getDoctorByFilters
    , fileUpload
    , fileDownload}