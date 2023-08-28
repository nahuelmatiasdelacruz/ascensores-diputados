const { knex } = require("../helpers/knexConfig");
const axios = require("axios");
const { syncDevices } = require("./controllerHelpers");

const getTiposEquipos =  async (req,res) => {
    try{
        const data = await knex.select("*").from("sgp.equipo_tipos").where({registro_activo: true});
        res.json(data);
    }catch(e){
        res.status(400).json({msg: "failed"});
    }
}
const getDispositivos = async (req,res)=>{
    try{
        const data = await knex.select("*").from("sgp.equipos").where("registro_activo",true);
        res.status(200).json(data);
    }catch(e){
        console.log(e);
        res.status(500).json({msg: "Hubo un error en la lectura de la base de datos"});
    }
}
const getTarjetas = async (req,res) => {
    try{
        const tarjetas = await knex.select("*").from("sgp.tarjetas").where({empleado_id: req.params.id,registro_activo: true});
        const parsed = tarjetas.map((tarjeta)=>{
            return {
                ...tarjeta,
                id: tarjeta.tarjeta_id
            }
        })
        res.json(parsed);
    }catch(e){
        res.status(400).json({msg: "Hubo un error en la lectura de la base de datos", error: e.message});
    }
}
const deleteDispositivo = async (req, res)=>{
    try{
        const { id, empleado_id } = req.params;
        await knex.raw(`call sgp.sp_equipo_del(${id}, 1);`);
        res.status(200).json({msg: "ok"});
    }catch(e){
        res.status(400).json({msg: "Hubo un error", detail: e.message});
    }
}
const addDispositivo = async (req, res)=>{
    const data = req.body;
    const result = await knex.raw(`call sgp.sp_equipo_ins(19, '${data.nombre}', '${data.ip}', '${data.puerto}', '${data.usuario}', '${data.password}', ${data.tipo}, 1, '${data.marca}', '${data.modelo}','${data.nro_serie}',1,null);`);
    res.status(200).json({msg: "ok", result});
}
const getEstadoDispositivo = async (req,res)=>{
    const estado = await axios.post(`http://${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}/`,{id: req.body.id},{
        headers: { "x-action": "EquipoEstaConectado"}
    });
    res.status(200).json({msg: "ok"});
}
const updateDispositivo = async (req, res)=>{
    const data = req.body;
    try{
        await knex.raw(`call sgp.sp_equipo_upd(${data.id},1,'${data.nombre}','${data.ip}','${data.puerto}','${data.usuario}','${data.password}',${data.tipo},1,'${data.marca}','${data.modelo}','${data.nro_serie}',1);`);
        res.status(200).json({msg: "ok"});
    }catch(e){
        res.status(500).json({msg: "Hubo un error", error: e.message});
    }
}
const addTarjeta = async (req, res)=>{
    try{
        await knex.raw(`call sgp.sp_tarjeta_ins(${req.body.empleado_id},1,'${req.body.numero}','${req.body.observaciones || null}','${req.body.fromDate}','${req.body.toDate}',false,1,null);`);
    }catch(e){
        return res.status(500).json({msg: "Hubo un error al agregar la tarjeta", error: e.message});
    }
    res.status(200).json({});
}
const getEquiposAsociados = async(req,res)=>{
    const {id} = req.params;
    try{
        const equiposAsociados = await knex
            .select("sgp.equipo_empleados.*", "sgp.vw_equipos.descripcion")
            .from("sgp.equipo_empleados")
            .join("sgp.vw_equipos", "sgp.equipo_empleados.equipo_id", "sgp.vw_equipos.equipo_id")
            .where({
              "sgp.equipo_empleados.registro_activo": true,
              "sgp.equipo_empleados.empleado_id": id
            });
        const idsAsociados = equiposAsociados.map((equipo)=>equipo.equipo_id);
        const equiposDisponibles = await knex.select("*").from("sgp.vw_equipos")
        .whereNotIn("equipo_id",idsAsociados)
        .andWhere("equipo_estado","ACTIVO");
        const parsedDisponibles = equiposDisponibles.map((ed)=>{
            return {
                label: ed.descripcion,
                id: ed.equipo_id
            }
        })
        const parsed = equiposAsociados.map((equipo)=>{
            return {
                ...equipo,
                id: equipo.equipo_empleado_id
            }
        })
        res.json({
            asociados: parsed,
            disponibles: parsedDisponibles
        });
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al buscar los equipos", error: e.message});
    }
}
const asociarEquipo = async (req, res) => {
    try{
        await knex.raw(`call sgp.sp_equipo_empleado_ins(
            :equipo_id,
            :empleado_id,
            1
        );`,{
            equipo_id: req.body.equipo_id,
            empleado_id: req.body.empleado_id
        })
        await syncDevices(req.body.empleado_id);
        res.status(200).json({msg: "ok"});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al asociar el equipo al empleado"});
    }
}
const borrarEquipoAsociado = async (req, res) => {
    const {empleado_id, equipo_asociado_id, equipo_id} = req.params;
    try{
        await knex.raw(`call sgp.sp_equipo_empleado_del(
            :equipo_empleado_id,
            1
        );`,{
            equipo_empleado_id: equipo_asociado_id,
        })
        const responseBorrar = await axios.post("http://127.0.0.1:9099",
            {
                id: `${empleado_id}`,
                equipos: [{id: `${equipo_id}`}]
            },
            {
                headers: {
                    "x-action":"QuitarUsuario"
                }
            }
        );
        if(responseBorrar.data.Response === "ERROR"){
                console.log(responseBorrar.data.Response);
                return res.status(500).json({msg: `Hubo un error en el servicio de equipos: ${responseBorrar.data.Response}`});
        }
        res.status(200).json({msg: "ok"});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: e.message});
    }
}
const dispositivosController = {
    asociarEquipo,
    borrarEquipoAsociado,
    getEquiposAsociados,
    getTarjetas,
    addTarjeta,
    getTiposEquipos,
    getDispositivos,
    deleteDispositivo,
    addDispositivo,
    getEstadoDispositivo,
    updateDispositivo
}

module.exports = {dispositivosController};