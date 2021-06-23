const { isValidObjectId } = require("mongoose");
const { Usuario, Producto, Categoria } = require("../models");

const buscarUsuarios = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);
    const regex = new RegExp(termino, 'i'); // EL PARAMETRO 'i' INDICA QUE NO DISTINGUE MAYUSCULAS DE MINUSCULAS
    let query = {
        $or: [
            { nombre: regex },
            { correo: regex }
        ],
        $and: [
            { estado: true }
        ]
    };

    if (esMongoId) {
        query = {
            _id: termino
        }
    }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    return res.json({
        total,
        result: usuarios
    })
}

const buscarProductos = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);
    let query = { precio: termino, estado: true };

    if (esMongoId) {
        query = {
            $or: [
                { usuario: termino },
                { categoria: termino }
            ],
            $and: [
                { estado: true }
            ]
        };
    }

    if (isNaN(Number(termino)) && !esMongoId) {
        // ES UN STRING
        const regex = new RegExp(termino, 'i');
        query = { nombre: regex, estado: true };
    }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
    ])

    return res.json({
        total,
        results: productos
    });
}

const buscarCategorias = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);
    const regex = new RegExp(termino, 'i');
    let query = { nombre: regex, estado: true };

    if (esMongoId) {
        query = { usuario: termino, estado: true };
    }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    return res.json({
        total,
        result: categorias
    });
}

module.exports = {
    buscarUsuarios,
    buscarProductos,
    buscarCategorias
}