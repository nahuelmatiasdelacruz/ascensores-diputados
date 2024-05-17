const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generateJWT');
const { knex } = require('../helpers/knexConfig');
const login = async (req,res) => {
    const{user,password} = req.body;
    try{
        const userDb = await knex.select('*').from('sgp.usuarios').where({
            username: user
        });
        if(userDb.length === 0){
            console.log('El usuario no existe en la base de datos');
            return res.status(400).json({msg: 'Usuario o contraseña incorrectos'});
        }
        if(userDb.habilitado === false){
            return res.status(400).json({msg: 'Usuario inhabilitado'});
        }
        console.log(userDb);
        const validPassword = bcryptjs.compareSync(password,userDb[0].password);
        if(!validPassword){
            console.log('Contraseña incorrecta');
            return res.status(400).json({msg: 'Usuario o contraseña incorrectos'});
        }
        if(userDb.length > 0){
            const token = await generarJWT(user.usuario_id);
            res.json({
                msg: 'Login OK',
                userData: {
                    userName: userDb[0].username,
                    nombres: userDb[0].nombres,
                    apellidos: userDb[0].apellidos
                },
                token
            });
        }else{
            res.status(400).json({msg: 'Usuario o contraseña incorrectos'});
        }
        
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Algo salio mal'});
    }
}

module.exports = {login}