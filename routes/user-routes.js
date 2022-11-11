// Path: /api/users

const {Router} = require('express');
const {check} = require('express-validator');
const {getUser
    , createUser
    , updateUser
    , deleteUser
    , getUserByFilters
    , fileUpload
    , fileDownload} = require('../controllers/userController');
const {validarCampos} = require('../midlewares/validar-campos');
const { validateJWT } = require('../midlewares/validate-jwt');
const fileUploadExpres = require('express-fileupload');

const router = Router();
router.use(fileUploadExpres());

router.get('/', [validateJWT], getUser);
router.get('/filters/:busqueda', [validateJWT], getUserByFilters);
router.post('/', 
            [
                check('name', 'The name is mandatory').not().isEmpty(),
                check('password', 'The password is mandatory').not().isEmpty(),
                check('email', 'The email is mandatory').isEmail(),
                validarCampos
            ], 
            createUser);
router.put('/:uuid', 
            [
                check('name', 'The name is mandatory').not().isEmpty(),
                check('role', 'The role is mandatory').not().isEmpty(),
                check('email', 'The email is mandatory').isEmail(),
                validarCampos
            ], 
            updateUser);
router.delete('/:uuid', deleteUser);
router.put('/upload/:uuid', [], fileUpload);
router.get('/download/:imgName', [], fileDownload);
module.exports = router;