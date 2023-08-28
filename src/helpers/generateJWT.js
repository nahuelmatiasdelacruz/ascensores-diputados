const jwt = require("jsonwebtoken");
const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = {uid};
        jwt.sign(payload,process.env.PRIVATE_KEY,(err,token)=>{
            if(err){
                console.log(err.message);
                reject("No se pudo generar el token");
            }else{
                resolve(token);
            }
        })
    })
}

module.exports = {generarJWT}