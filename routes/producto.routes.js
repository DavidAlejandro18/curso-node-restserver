const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/producto.controller');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

router.post('/', [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un id válido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),


    // VALIDAR LA CATEGORIA, QUE SEA UN ID VÁLIDO
    check("categoria", "No es un id válido").optional().isMongoId(),
    check("categoria").optional().custom(existeCategoriaPorId),


    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;