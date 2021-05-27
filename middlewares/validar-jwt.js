const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token"); // EL TOKEN DEL USUARIO QUE QUIERE HACER UNA ELIMINACIÓN

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en esta petición"
        });
    }

    try {
        // VERIFICAMOS QUE EL USUARIO QUE QUIERE HACER LA ELIMINACIÓN TENGA UN TOKEN VALIDO
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        const usuario = await Usuario.findById(uid); // SI ES VÁLIDO, BUSCAMOS TODA SU INFO

        // VERIFICAR SI EL USUARIO EXISTE
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en la DB"
            });
        }

        // VERIFICAR SI EL UID TIENE UN ESTADO TRUE
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token no válido - usuario con estado false"
            });
        }
        
        req.usuario = usuario; // GUARDAMOS LA INFO DEL USUARIO 

        next();
    } catch (error) {
        console.log(error);

        res.status(401).json({
            msg: "Token no válido"
        });
    }

}

module.exports = {
    validarJWT
}