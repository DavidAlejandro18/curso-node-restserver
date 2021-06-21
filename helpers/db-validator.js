const { Categoria, Producto } = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

// ESTA FUNCIÓN BUSCA ENTRE LA COLECCIÓN SI EXISTE EL TIPO DE ROLE INSERTADO
const esRoleValido = async (role = '') => {
    const existeRole = await Role.findOne({ role }); // BUSCAMOS CON EL MODELO SI EXISTE EL ROLE MANDADO POR EL USUARIO EN LA DB

    if (!existeRole) {
        throw new Error(`El role '${role}' no esta registrado en la DB`); // SINO EXISTE GENERAMOS UN ERROR QUE SE MANDE A LA API
    }
}

const esCorreoValido = async(correo = '') => {
    // VERIFICAR SI EL CORREO YA EXISTE 
    const esEmail = await Usuario.findOne({ correo }); // LOS BUSCA CON LA INSTANCIA DEL MODELO EN LA DB
    if (esEmail) {
        throw new Error(`El correo '${correo}' ya existe`);
    }
}

const existeUsuarioPorId = async(id = '') => {
    // VERIFICAR SI EL CORREO YA EXISTE 
    const existeUsuario = await Usuario.findById(id); // LOS BUSCA CON LA INSTANCIA DEL MODELO EN LA DB
    if (!existeUsuario) {
        throw new Error(`El id '${id}' no existe`);
    }
}

const existeCategoriaPorId = async(id = '') => {
    const existeCategoria = await Categoria.findById(id); // LOS BUSCA CON LA INSTANCIA DEL MODELO EN LA DB
    if (!existeCategoria) {
        throw new Error(`El id '${id}' no existe`);
    }
}

const existeProductoPorId = async(id = '') => {
    const existeProducto = await Producto.findById(id); // LOS BUSCA CON LA INSTANCIA DEL MODELO EN LA DB
    if (!existeProducto) {
        throw new Error(`El id '${id}' no existe`);
    }
}

module.exports = {
    esRoleValido,
    esCorreoValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}