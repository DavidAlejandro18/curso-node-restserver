const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const path = require('path');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth:       "/api/auth",
            buscar:     "/api/buscar",
            usuarios:   "/api/usuarios",
            categorias: "/api/categorias",
            productos:  "/api/productos"
        }
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
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/producto.routes'));
    }

    listen() {
        this.app.get('/api*', (req, res) => {
            res.status(404).json({
                msg: '404 | NOT FOUND'
            });
        });
        
        this.app.get('*', (req, res) => {
            res.status(404).sendFile(path.join(__dirname, '../', '/public/404.html'));
        })


        this.app.listen(this.port, () => {
            console.log(`Server is starting on port: ${this.port}`);
        });
    }
}

module.exports = Server;