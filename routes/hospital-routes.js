// PATH: /api/hospital

const {Router} = require('express');
const { check } = require("express-validator");
const {validarCampos} = require('../midlewares/validar-campos');
const {validateJWT} = require('../midlewares/validate-jwt');
const {getHospital
    , createHospital
    , updateHospital
    , deleteHospital
    , getHospitalByFilters
    , fileUpload
    , fileDownload} = require('../controllers/hospitalController');
const fileUploadExpres = require('express-fileupload');

const router = Router();
router.use(fileUploadExpres());

router.get('/', [validateJWT], getHospital);
router.get('/filters/:busqueda', [validateJWT], getHospitalByFilters);
router.post('/', 
            [
                validateJWT,
                check('name', 'Hospital name is required').not().isEmpty(),
                validarCampos
            ], 
            createHospital);
router.put('/:uuid', 
            [
            ], 
            updateHospital);
router.delete('/:uuid', deleteHospital);
router.put('/upload/:uuid', 
            [], 
            fileUpload);
router.get('/download/:imgName', 
            [], 
            fileDownload);

module.exports = router;