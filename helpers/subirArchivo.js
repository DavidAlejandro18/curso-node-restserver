const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    
    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        // VALIDAR LA EXTENSIÓN
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension '${extension}' no es válido. Opciones válidas: ${extensionesValidas}`);
        }

        const nombreTemp = `${uuidv4()}.${extension}`;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp); // RUTA DONDE SE VAN A GUARDAR LAS IMAGENES (POR AHORA) DE FORMA LOCAL

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemp);
        });
    });
    
}

module.exports = {
    subirArchivo
}