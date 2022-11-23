const {Router} = require('express');
const { check } = require('express-validator');

const {login} = require('../controllers/outhController');
const {googleSignIn} = require('../controllers/outhController');
const { validarCampos } = require('../midlewares/validar-campos');

const router = Router();

router.post('/', 
            [
                check('email', 'Email or password invalid').isEmail(),
                check('password', 'Email or password invalid').not().isEmpty(),
                validarCampos
            ], 
            login);

router.post('/google', 
            [
                check('token', 'Invalid token').not().isEmpty(),
                validarCampos
            ], 
            googleSignIn);


module.exports = router;