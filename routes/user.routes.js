const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/user.controller');
const { esRoleValido, esCorreoValido, existeUsuarioPorId } = require('../helpers/db-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    // EN ESTA SECCIÓN SE INSERTAN LOS MIDDLEWARES
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe de ser mayor a 6 letras").isLength({ min: 6 }),
    check("correo", "El correo no es valido").isEmail(),
    check('correo').custom(esCorreoValido),
    //check("role", "No es un role válido").isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(esRoleValido),
    validarCampos // AGREGAMOS NUESTRO MIDDLEWARE PERSONALIZADO
], usuariosPost);

router.put('/:id', [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check('role').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;