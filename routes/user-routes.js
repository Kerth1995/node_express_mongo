// Path: /api/users

const {Router} = require('express');
const {check} = require('express-validator');
const {getUser, createUser, updateUser, deleteUser} = require('../controllers/userController');
const {validarCampos} = require('../midlewares/validar-campos');
const { validateJWT } = require('../midlewares/validate-jwt');

const router = Router();

router.get('/', [validateJWT], getUser);
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

module.exports = router;