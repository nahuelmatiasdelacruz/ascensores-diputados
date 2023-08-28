const { knex } = require("../helpers/knexConfig");
const axios = require("axios");
const { syncDevices } = require("./controllerHelpers");

const getHuellas = async (req,res)=>{
    const {id} = req.params;
    try{
        const data = await knex.select("*").from("sgp.huellas").where({
            empleado_id: id,
            registro_activo: true
        });
        const parsed = data.map((huella)=>{
            return {
                ...huella,
                descripcion: `Huella dactilar: ${huella.huella_id}`,
                id: huella.huella_id
            }
        })
        res.status(200).json(parsed);
    }catch(e){
        res.status(400).json({msg: "Error al buscar las huellas",error: e.message});
    }
}
const syncHuellas = async (req, res)=>{
    try{
        await syncDevices(req.params.id);
        return res.status(200).json({msg: "Se han sincroinzado las huellas y dispositivos correctamente"});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "No se han podido sincronizar las huellas", error: e.message});
    }
}
const syncAll = async (req,res) => {
    try{
        let empleadosId = await knex.select("empleado_id").from("sgp.vw_empleados").where({registro_activo: true});
        for (let empleadoId in empleadosId){
            await syncDevices(empleadoId);
        }
        return res.status(200).json({msg: "OK"});
    }catch(e){
        console.log(e.message);
        return res.status(500).json({msg: "Hubo un error al sincronizar", error: e.message});
    }
}
const massiveSync = async (req,res) => {
    try{
        const data = await knex.select("*").from("sgp.vw_empleados").where({registro_activo: true});
        const parsed = data.map((emp)=>{
            return {
                id: `${emp.empleado_id}`
            }
        });
        const rows = {
            rows: parsed
        }
        const response = await axios.post("http://127.0.0.1:9099",rows,{
            headers: {
                "x-action":"AgregarUsuariosMasivos"
            }
        });
        if(response.data.Response === "OK"){
            return res.status(200).json({msg: "ok"});
        }else{
            console.log(response.data);
            return res.status(500).json({msg: "Hubo un error al sincronizar todo"});
        }
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: "Hubo un error al sincronizar todo"});
    }
}
const getHuellaById = async (req,res)=>{

}
const checkIfUserHasDevice = async (equipo_id,user_id) => {
    try{
        const response = await axios.post("http://127.0.0.1:9099",{
            id: user_id,
            equipo: equipo_id
            },
            {
                headers: {
                    "x-action":"EstaEnElEquipo"
                }
            });
        return response.Message;
    }catch(e){
        console.log(e.message);
        return false;
    }
}
const addHuella = async (req,res)=>{
    const {equipo_id, user_id, descripcion} = req.body;
    console.log(`1- Datos que envío desde el front: \nEquipo ID: ${equipo_id}\nUser ID: ${user_id}\nDedo: ${descripcion}`);
    const dispositivo = await knex.select("*").from("sgp.vw_equipos").where({
        equipo_estado: "ACTIVO",
        equipo_id
    });
    const {equipo_tipo_id} = dispositivo[0];
    try{
        // Agregar el usuario al equipo
        const isIncludedInDevice = await checkIfUserHasDevice(equipo_id,user_id);
        console.log(`2- Comprobando si el usuario ya existe en el equipo. \nResultado: ${isIncludedInDevice}`);
        if(equipo_tipo_id !== 4 && !isIncludedInDevice){
            const response = await axios.post("http://127.0.0.1:9099",{
            id: `${user_id}`,
            equipos: [{id: `${equipo_id}`}]
            },
            {
                headers: {
                    "x-action":"AgregarUsuario"
                }
            })
            if(response.data.Response === "ERROR"){
                console.log(`3- ERROR: Hubo un error en el procedimiento: AgregarUsuario`);
                return res.status(500).json({msg: response.Message});
            }
            console.log(`3- Proceso AgregarUsuario COMPLETADO`);
        }
        // Enrolar el usuario una vez agregado al equipo
        const responseEnrolar = await axios.post("http://127.0.0.1:9099",
        {
            id: `${equipo_id}`,
            id_usuario: user_id,
            descripcion
        },
        {
            headers:{
                "x-action":"EnrolarHuellaEquipo"
            }
        });
        if(responseEnrolar.data.Response === "ERROR"){
            console.log(`4- ERROR: Hubo un error en el procedimiento: EnrolarHuellaEquipo`);
            console.log(responseEnrolar.data);
            return res.status(500).json({msg: "Error en el servicio a la hora de enrolar"});
        }
        console.log(`4- Proceso EnrolarHuellaEquipo COMPLETADO`);

        // Borrar el usuario ya que no va a utilizarse
        if(equipo_tipo_id !== 4 && !isIncludedInDevice){
            const responseBorrar = await axios.post("http://127.0.0.1:9099",
            {
                id: `${user_id}`,
                equipos: [{id: `${equipo_id}`}]
            },
            {
                headers: {
                    "x-action":"QuitarUsuario"
                }
            }
            );
            if(responseBorrar.data.Response === "ERROR"){
                console.log(`5- ERROR En el proceso: QuitarUsuario`);
                return res.status(500).json({msg: "Hubo un error en el proceso de enrolamiento: BORRADO DEL USUARIO LUEGO DE REGISTRAR LA HUELLA", error: responseBorrar.data.Response});
            }
            console.log(`5- Proceso QuitarUsuario COMPLETADO`);
        }
        await syncDevices(user_id);
        return res.status(200).json({msg: "OK"});
    }catch(e){
        console.log(e.message);
        return res.status(500).json({msg: "Hubo un error al borar la huella del equipo luego de enrolar", error: e.message});
    }

}
const updateHuella = async (req,res)=>{

}
const deleteHuella = async (req,res)=>{
    const {huella_id} = req.params;
    try{
        const user = await knex.select("*").from("sgp.vw_huellas").where({
            huella_id
        });
        await syncDevices(user[0].empleado_id);
        console.log("Sincronizacion de dispositivos luego de borrar huella COMPLETADO");
        await knex.raw(`call sgp.sp_huella_del(${huella_id},1)`);
        res.status(200).json({msg: "Se ha borrado con éxito la huella"});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al borrar la huella", error: e.message});
    }
}

const huellasController = {
    syncAll,
    getHuellas,
    getHuellaById,
    massiveSync,
    addHuella,
    updateHuella,
    deleteHuella,
    syncHuellas
}

module.exports = {huellasController};