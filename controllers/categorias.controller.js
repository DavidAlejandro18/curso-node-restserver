const { response, request } = require("express");
const { Categoria } = require("../models");

// obtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query; // paginado
    const query = { estado: true };

    // RETORNA DATOS CUANDO LAS 2 PROMESAS SE CUMPLEN CON EXITO
    // DE LO CONTRARIO, NO RETORNA NADA
    // SEPARA LOS RESULTADOS DE CADA PROMESA MEDIANTE LOS ARRAYS
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query).skip(Number(from)).limit(Number(limit)),
        Categoria
            .find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate("usuario", "nombre")
            // RELACIONAR EL ID DEL USUARIO CON LA TABLA DE USUARIO
            // Y EXTRAER EL NOMBRE DEL DOCUMENTO QUIE COINCIDA
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - id - populate {}
const obtenerCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        categoria
    });
}


const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });
    
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria '${categoriaDB.nombre}' ya existe.`
        });
    }

    // GENERAR LA DATA A GUARDAR
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = await new Categoria(data);

    // GUARDAR EN DB
    await categoria.save();

    res.status(201).json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoriaDB = await Categoria.findOne({ nombre: data.nombre });
    
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria '${categoriaDB.nombre}' ya existe.`
        });
    }

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);
}

// borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    // el new: true significa que el resultado obtenido de categoriaBorrada vendra actualizado
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });
    
    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}