// PATH: /api/doctor

const {Router} = require('express');
const { check } = require("express-validator");
const {validarCampos} = require('../midlewares/validar-campos');
const {validateJWT} = require('../midlewares/validate-jwt');
const {getDoctor
    , createDoctor
    , updateDoctor
    , deleteDoctor
    , getDoctorByFilters
    , fileUpload
    , fileDownload} = require('../controllers/doctorController.js');
const fileUploadExpres = require('express-fileupload');

const router = Router();
router.use(fileUploadExpres());

router.get('/', [validateJWT], getDoctor);
router.get('/filters/:busqueda', [validateJWT], getDoctorByFilters);
router.post('/', 
            [
                validateJWT,
                check('name', 'Name is requiered').not().isEmpty(),
                check('hospital', 'Hospital id is requiered.').not().isEmpty(),
                check('hospital', 'Hospital id is invalid.').isMongoId(),
                validarCampos,
            ], 
            createDoctor);
router.put('/:uuid', 
            [], 
            updateDoctor);
router.delete('/:uuid', deleteDoctor);
router.put('/upload/:uuid', 
            [], 
            fileUpload);
router.get('/download/:imgName', 
            [], 
            fileDownload);

module.exports = router;