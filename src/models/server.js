const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

class Server{
    constructor(){
        this.app = express();
        this.filesFolderPath = path.join(__dirname,"..","..","uploads");
        this.port = process.env.PORT || 8080;
        this.paths = {
            auth: "/api/auth",
            configuracion: "/api/configuracion",
            dispositivos: "/api/dispositivos",
            docs: "/api/docs",
            empleados: "/api/empleados",
            enrolaciones: "/api/enrolaciones",
            find: "/api/find",
            grupos: "/api/grupos",
            habilitaciones: "/api/habilitaciones",
            huellas: "/api/huellas",
            marcaciones: "/api/marcaciones",
            registros: "/api/registros",
            users: "/api/users",
            visitas: "/api/visitas",
        };
        this.middlewares();
        this.routes();
    }
    async conectarDb(){
        await dbConnection();
    }
    middlewares(){
        this.app.use(express.static((this.filesFolderPath)));
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname,"..","client","build")));
        this.app.use(bodyParser.json({limit: "10mb"}));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }
    routes(){
        this.app.get("/",(req,res)=>{
            res.sendFile(path.join(__dirname,"..","client","build","index.html"));
        })
        this.app.use(this.paths.auth,require("../routes/auth"));
        this.app.use(this.paths.dispositivos,require("../routes/dispositivos"));
        this.app.use(this.paths.docs, require("../routes/docs"));
        this.app.use(this.paths.empleados,require("../routes/empleados"));
        this.app.use(this.paths.enrolaciones,require("../routes/enrolaciones"));
        this.app.use(this.paths.grupos,require("../routes/grupos"));
        this.app.use(this.paths.habilitaciones,require("../routes/habilitaciones"));
        this.app.use(this.paths.huellas,require("../routes/huellas"));
        this.app.use(this.paths.marcaciones,require("../routes/marcaciones"));
        this.app.use(this.paths.configuracion,require("../routes/configuracion"));
        this.app.use(this.paths.registros,require("../routes/registros"));
        this.app.use(this.paths.users,require("../routes/users"));
        this.app.use(this.paths.visitas,require("../routes/visitas"));
        this.app.get("*", (req,res)=>{
            res.redirect("/");
        })
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log("Servidor REST Ascensores - ON!");
        })
    }
}

module.exports = Server;

