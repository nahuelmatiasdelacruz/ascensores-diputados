const jwt = require('jsonwebtoken');
const User = require("../models/db/user");

const validarJwt = async (req,res,next) => {
    const token = req.header("x-token");
    if(!token){
        return res.status(401).json({
            msg: "No hay token en la petición"
        })
    }
    try{
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(uid);
        if(!user){
            return res.status(401).json({
                msg: "El usuario no existe en la db"
            });
        }
        if(!user.estado){
            return res.status(401).json({
                msg: "El usuario está deshabilitado"
            });
        }
        req.user = user;
        next();
    }catch(e){
        res.status(401).json({
            msg: "Token no valido"
        })
    }
}

module.exports = {validarJwt}