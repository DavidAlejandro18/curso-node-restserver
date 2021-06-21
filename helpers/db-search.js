const { isValidObjectId } = require("mongoose");
const { Usuario, Producto, Categoria } = require("../models");

const buscarUsuarios = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            result: ( usuario ) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); // EL PARAMETRO 'i' INDICA QUE NO DISTINGUE MAYUSCULAS DE MINUSCULAS
    const usuarios = await Usuario.find({
        // ESTO ES PARA INDICAR MULTIPLES QUERY'S DE BUSQUEDA, EN CASO DE QUE UNA NO RETORNE NADA TOMARA EL OTRO
        $or: [
            { nombre: regex },
            { correo: regex }
        ],
        // ESTO SE TIENE QUE EJECUTAR EN CONJUNTO CON LAS QUERY'S DE ARRIBA
        $and: [
            { estado: true }
        ]
    });

    res.json({
        result: usuarios
    })
}

const buscarProductos = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const productos = await Producto.find({
            $or: [
                { usuario: termino },
                { categoria: termino }
            ],
            $and: [
                { estado: true }
            ]
        })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');

        return res.json({
            result: productos
        });
    }

    if (isNaN(Number(termino))) {
        // ES UN STRING
        const regex = new RegExp(termino, 'i');
        const productos = await Producto.find({ nombre: regex, estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            result: productos
        })
    }

    // ES UN NÚMERO
    const productos = await Producto.find({ precio: termino, estado: true })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        result: productos
    });
}

const buscarCategorias = async(termino, res = response) => {
    const esMongoId = isValidObjectId(termino);

    if (esMongoId) {
        const categorias = await Categoria.find({ usuario: termino, estado: true }).populate('usuario', 'nombre');

        return res.json({
            result: categorias
        });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({ nombre: regex, estado: true }).populate('usuario', 'nombre');

    res.json({
        result: categorias
    });
}

module.exports = {
    buscarUsuarios,
    buscarProductos,
    buscarCategorias
}