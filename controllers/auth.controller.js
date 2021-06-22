const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignin = async (req, res = response) => {
    const { id_token } = req.body;

    try {
        const { correo, nombre, img, userId } = await googleVerify(id_token);

        // ENCRIPTAR EL ID PROPORCIONADO POR GOOGLE PARA USARLO COMO CONTRASEÑA
        const salt = bcryptjs.genSaltSync();
        const password = bcryptjs.hashSync(userId, salt);
    
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            // TENGO QUE CREAR EL USUARIO PORQUE NO EXISTE EN LA DB
            const data = {
                nombre,
                correo,
                password,
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // SI EL USUARIO EN LA DB 
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el usuario, usuario bloqueado'
            });
        }

        // GENERAR EL JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: "Token de Google no es válido"
        });
    }

}

module.exports = {
    login,
    googleSignin
}