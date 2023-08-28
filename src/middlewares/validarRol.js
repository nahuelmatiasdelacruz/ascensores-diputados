const esAdminRole = async (req,res,next)=> {
    const {role,nombre} = req.user;
    if(role!=="ADMIN_ROLE"){
        return res.status(401).json({
            msg: `El usuario ${nombre} no es administrador`
        });
    }
    next();
}
const tieneRol = (...roles)=>{
    return (req,res,next)=>{
        const {role} = req.user;
        if(!roles.includes(role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }
}
module.exports = {esAdminRole,tieneRol};