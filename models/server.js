const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = "/api/usuarios";
        
        // MIDDLEWARES
        this.middlewares();

        // RUTAS
        this.routes();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Parse y lectura del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosRoutePath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is starting on port: ${this.port}`);
        });
    }
}

module.exports = Server;