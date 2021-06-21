const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validator');
const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// OBTENER TODAS LAS CATEGORIAS - PUBLICO
router.get('/', obtenerCategorias);

// OBTENER UNA CATEGORIA POR ID - PUBLICO
router.get('/:id', [
    check("id", "No es un id válido").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// CREAR CATEGORIA - PRIVADO - CUALQUIER PERSONA CON UN TOKEN VALIDO
router.post('/', [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos
], crearCategoria);

// ACTUALIZAR UNA CATEGORIA - PRIVADO - CUALQUIERA CON UN TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "No es un id válido").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// BORRAR UNA CATEGORIA - ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check("id", "No es un id válido").isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;