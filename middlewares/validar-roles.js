const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {
    // VERIFICAR SI EL USUARIO EXISTE EN LA REQUEST
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se quiere verificar el role sin validar el token primero"
        });
    }

    const { role, nombre } = req.usuario; // EXTRAEMOS EL ROLE Y EL NOMBRE

    // VERIFICAMOS EL ROLE DEL USUARIO
    if (role !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        });
    }
    
    next();
}

// ES LA MISMA FUNCIÓN DE ARRIBA, PERO ESCALABLE
const tieneRole = (...roles) => { // RECIBE TODOS LOS ROLES PERMITIDOS POR PARAMETROS
    // RETORNA UAN FUNCIÓN CON LA ESTRUCTURA DE UN MIDDLEWARE CONVENCIONAL
    return (req, res = response, next) => {
        // VERIFICAR SI EL USUARIO EXISTE EN LA REQUEST
        if (!req.usuario) {
            return res.status(500).json({
                msg: "Se requiere verificar el role sin validar el token primero"
            });
        }

        // VERIFICAR SI EL ROLE DEL USUARIO ESTA EN UNO DE LOS PERMITODOS PARA HACER CAMBIOS (ELIMINAR UN USUARIO) EN LA DB
        if (!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            });
        }

        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}