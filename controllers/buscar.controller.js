const { response, request } = require("express");
const { buscarUsuarios, buscarCategorias, buscarProductos } = require("../helpers/db-search");

const coleccionesPermitidas = [
    'usuarios',
    'productos',
    'categorias',
    'roles'
];

const buscar = async(req = request, res = response) => {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg: `Se te olvido hacer esta busqueda`
            });
    }
}

module.exports = {
    buscar
}