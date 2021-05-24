const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario'); // SE IMPORTA EL MODELO, SE PONE EN MAYUSCULAS PORQUE ASI ES EL ESTANDAR DE UNA INSTANCIA DEL MODELO

const usuariosGet = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true }; // QUERY QUE REGRESA TODOS LOS DOCUMENTOS QUE TENGAS ESTADO EN TRUE

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query), // CONTABILIZAMOS LOS DOCUMENTOS (REGISTROS)
        Usuario.find(query).skip(Number(from)).limit(Number(limit))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, role } = req.body;
    // LA INSTANCIA QUE MENCIONAMOS ARRIBA SINO SERIA `const usuario = new usuario()`
    const usuario = new Usuario({ nombre, correo, password, role }); // LE PASAMOS AL MODELO SOLO CIERTA INFORMACIÓN....POR AHORA

    // ENCRITAR LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save(); // ESPERAMOS A QUE SE GUARDE LO DEL MODELO EN LA DB

    res.status(201).json({
        msg: "post API - controlador",
        usuario // MOSTRAMOS LA INFORMACIÓN QUE NOS RETORNA NUESTRO MODELO
    });
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body; // EXTRAEMOS EL PASSWORD, GOOGLE Y CORREO DE LOS DATOS RECIBIDOS

    // TODO Validar contra DB
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt); // SI SE MANDA EL PASSWORD, SE ENCRIPTA Y SE AGREGA A LOS DATOS QUE VAMOS A ACTUALIZAR
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto); // BUSCA EL REGISTRO POR ID Y LO ACTUALIZA

    res.status(400).json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    // BORRADO FISICAMENTE
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}