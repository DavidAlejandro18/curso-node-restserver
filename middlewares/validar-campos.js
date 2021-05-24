const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errors = validationResult(req); // ATRAPAMOS LOS ERRORES QUE SE ENCUENTREN EN EL REQUEST
    if (!errors.isEmpty()) {
        return res.status(400).json(errors); // SI HAY PRESENCIA DE ERRORES, LOS VAMOS A RETORNAR
    }

    next(); // SI TODO ESTA BIEN, SE MOVERA AL CONTROLADOR, SINO 
}

module.exports = {
    validarCampos
}