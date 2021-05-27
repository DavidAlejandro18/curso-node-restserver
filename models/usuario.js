const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [
            true, 
            'El nombre es obligatorio' // MENSAJE DE ERROR EN CASO DE QUE FALLE EL REQUIRED EN LA DB, AUNQUE ES MEJOR TOMARLO DESDE LA VALIDACIÓN
        ]
    },
    correo: {
        type: String,
        required: [
            true, 
            'El correo es obligatorio'
        ],
        unique: true
    },
    password: {
        type: String,
        required: [
            true, 
            'La contraseña es obligatoria'
        ]
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'] // MOSTRAR LAS DIFERENTES OPCIONES QUE PUEDEN OCUPAR ESTE CAMPO COMO SU VALOR
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// MÉTODO QUE SIRVE PARA EXTRAER CIERTOS VALORES DEL ESQUEMA Y RETORNAR EL RESTO
UsuarioSchema.methods.toJSON = function() {
    const { _id, __v, password, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);