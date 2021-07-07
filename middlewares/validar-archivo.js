const { response, request } = require("express")

const validarArchivoSubir = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) { // REVISA SI NO HAY ARCHIVOS EN LA REQUEST, MANDA UN STATUS 400 Y UN MENSAJE DE ERROR
        return res.status(400).json({
            msg: 'No hay archivo que subir - validarArchivoSubir'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir
}