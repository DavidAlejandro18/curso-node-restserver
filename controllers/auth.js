const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        // VERIFICAR SI EL EMAIL EXISTE EN LA DB
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - correo"
            });
        }
        
        // SI EL USUARIO ESTA ACTIVO EN LA DB
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - estado: false"
            });
        }
        
        // VERIFICAR LA CONTRASEÑA
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario/Password no son correctos - password"
            });
        }
        
        // GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador"
        });
    }

}

module.exports = {
    login
}