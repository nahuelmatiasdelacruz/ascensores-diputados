const { knex } = require('../helpers/knexConfig');

const subirDocumentacion = async (req,res) => {
    const archivo = req.file;
    try{
        await knex.raw(`call sgp.sp_adjunto_ins(:empleado_id,:descripcion,:filename,1,null);`,{
            empleado_id: req.body.empleado_id,
            descripcion: req.body.observaciones,
            filename: archivo.originalname,
        });
        return res.status(200).json({msg: 'ok'});
    }catch(e){
        console.log(e.message);
        return res.status(500).json({msg: `Hubo un error al cargar el archivo: ${e.message}`});
    }
}
const getDocumentaciones = async (req,res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({msg: `Hubo un error al ver los archivos: ${e.message}`});
    }
    const data = await knex.select('*').from('sgp.adjuntos').where({
        empleado_id: id,
        registro_activo: true
    });
    const parsed = data.map((doc)=>{
        return {
            ...doc,
            id: doc.adjunto_id
        }
    })
    res.json(parsed);
}
const getDocById = async (req,res) => {
    const {id} = req.params;
    const file = await knex.select('archivo_nombre').from('sgp.adjuntos').where('adjunto_id',id);
    const filePath = `uploads/${file[0].archivo_nombre}`;
    try{
        res.download(filePath,file[0].archivo_nombre,(err)=>{
            if(err){
                console.log(err.message);
                res.status(500).json({msg: `Hubo un error al ver el archivo: ${e.message}`});
            }
        })
    }catch(e){
        console.log(e.message);
        return res.status(500).json({msg: `Hubo un error al ver el archivo: ${e.message}`});
    }
}
const deleteDoc = async (req, res) => {
    console.log(req.params.id);
    try{
        console.log('Borrando documento con ID: ' + req.params.id);
        await knex.raw(`call sgp.sp_adjunto_del(:p_adjunto_id,1);`,{
            p_adjunto_id: req.params.id
        });
        return res.status(200).json({msg: 'ok'});
    }catch(e){
        console.log(e);
        res.status(500).json({msg: 'Hubo un error al borrar la documentación'});
    }
}
const docsController = {
    deleteDoc,
    getDocById,
    getDocumentaciones,
    subirDocumentacion
}

module.exports = {docsController}