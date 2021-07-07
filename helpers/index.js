const dbSearch = require('./db-search');
const dbValidators = require('./db-validator');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subirArchivo');

module.exports = {
    ...dbSearch,
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}