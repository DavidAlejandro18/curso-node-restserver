const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = "/api/usuarios";
        this.authPath = "/api/auth";
        
        // CONECTAR A BASE DE DATOS 
        this.conectarDB();

        // MIDDLEWARES
        this.middlewares();

        // RUTAS
        this.routes();
    }

    async conectarDB() {
        await dbConection();
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
        this.app.use(this.authPath, require('../routes/auth.routes'));
        this.app.use(this.usuariosRoutePath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is starting on port: ${this.port}`);
        });
    }
}

module.exports = Server;