const { response, request } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async (req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query).skip(Number(from)).limit(Number(limit)),
        Producto
            .find(query)
            .skip(Number(from))
            .limit(Number(limit))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async (req = request, res = response) => {
    const { _id, estado, usuario, ...body } = req.body;
    body.nombre = body.nombre.toUpperCase();
    body.desc = body.desc.toUpperCase();
    body.usuario = req.usuario._id;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto '${productoDB.nombre}' ya existe.`
        });
    }

    const producto = await new Producto(body);

    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    if (data.desc) {
        data.desc = data.desc.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const productoDB = await Producto.findOne({ nombre: data.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto '${productoDB.nombre}' ya existe.`
        });
    }

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}

const borrarProducto = async(req = request, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(productoBorrado);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}