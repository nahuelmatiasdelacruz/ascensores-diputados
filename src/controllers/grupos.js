const { default: axios } = require("axios");
const { knex } = require("../helpers/knexConfig");

const getGrupos = async (req,res)=>{
    try{
        const data = await knex.select("*").from("sgp.grupos").where("registro_activo",true);
        const gruposEquipos = await knex.select("*").from("sgp.grupo_equipos").where("registro_activo",true);
        const parsed = data.map(grupo=>{
            const equipos = gruposEquipos.filter(equipo=>equipo.grupo_id === grupo.grupo_id);
            return {
                ...grupo,
                cantidad_equipos: equipos.length,
                id: grupo.grupo_id
            }
        })
        res.json(parsed);
    }catch(e){
        console.log(e);
        res.status(500).json({msg: "Hubo un error al buscar los grupos"});
    }
}
const getGrupoById = async (req,res) => {
    try{
        const {id} = req.params;
        let equiposAsociados = await knex.select("*").from("sgp.vw_grupos_equipos").where({grupo_id:id,registro_activo: true});
        console.log(equiposAsociados);
        equiposAsociados = equiposAsociados.map(equipo=>{
            return {
                ...equipo,
                id: equipo.equipo_id
            }
        })
        const allDevices = await knex.select("*").from("sgp.equipos").where("registro_activo",true);
        let equiposFiltrados = allDevices.filter(equipo=>!equiposAsociados.some(equipoB=>equipoB.equipo_id === equipo.equipo_id));
        equiposFiltrados = equiposFiltrados.map(equipo=>{
            return {
                id: equipo.equipo_id,
                label: equipo.descripcion
            }
        })
        res.json({equiposFiltrados,equiposAsociados});
    }catch(e){
        console.log(e.message);
        res.status(400).json({msg: "Hubo un error", error: e.message});
    }
}
const addGroup = async (req,res)=>{
    try{
        const grupo = req.body;
        const response = await knex.raw(`call sgp.sp_grupo_ins('${grupo.nombre}',1,null);`);
        res.status(200).json({msg: "ok"});
    }catch(e){
        res.status(400).json({msg: "error", error: e.message});
    }
}
const addGrupoEquipo = async (req,res)=>{
    try{
        const {equipo_id,grupo_id} = req.body;
        await knex.raw(`call sgp.sp_grupo_equipo_ins('${grupo_id}','${equipo_id}',1);`);
        await knex("sgp.equipo_empleados").insert(parsed);
        res.status(200).json({msg: "ok"});
    }catch(e){
        console.log(e.message);
        res.status(400).json({msg: "Hubo un error al agregar el equipo al grupo", error: e.message});
    }
}
const updateGroup = async (req,res)=>{
    try{
        await knex.raw(`call sgp.sp_grupo_upd(${req.body.grupo_id},'${req.body.nuevoNombre}',1);`);
        res.status(200).json({msg: "Ok"});
    }catch(e){
        res.status(400).json({msg: "Error", error: e.message});
    }
}
const deleteGroup = async (req,res)=>{ 
    try{
        await knex.raw(`call sgp.sp_grupo_del(${req.params.id},1);`);
        res.status(200).json({msg: "ok"});
    }catch(e){
        res.status(400).json({msg: "Hubo un error al borrar el grupo",error: e.message});
    }
}
const deleteGrupoEquipo = async(req,res)=>{
    const equipo_id = req.params.id;
    try{
        await knex.raw(`call sgp.sp_grupo_equipo_del(${equipo_id},1);`);
        await knex("sgp.equipo_empleados").where("equipo_id",equipo_id).del();
        console.log(borrados);
        res.status(200).json({msg: "Se ha borrado el equipo correctamente"});
    }catch(e){
        res.status(400).json({msg: "Hubo un error al borrar el equipo", error: e.message});
        console.log(e.message);

    }
}
const getGruposAsociados = async(req,res)=>{
    const {id} = req.params;
    try{
        const gruposAsociados = await knex.select("*").from("sgp.vw_grupo_empleados").where({
            registro_activo: true,
            empleado_id: id
        });
        const gruposAsociadosIds = gruposAsociados.map((grupo)=>grupo.grupo_id);
        const gruposDisponibles = await knex.select("*").from("sgp.grupos")
        .whereNotIn("grupo_id",gruposAsociadosIds)
        .andWhere("registro_activo",true);

        const parsedDisponibles = gruposDisponibles.map((ga)=>{
            return {
                label: ga.descripcion,
                id: ga.grupo_id,
            }
        })
        const parsedAsociados = gruposAsociados.map((grupo)=>{
            return {
                ...grupo,
                id: grupo.grupo_empleado_id
            }
        })
        res.json({
            asociados: parsedAsociados,
            disponibles: parsedDisponibles
        });
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al buscar los grupos", error: e.message});
    }
}
const asociarGrupo = async (req,res) => {
    let equiposToAsociate = [];
    const {grupo_id, empleado_id} = req.body;
    try{
        await knex.raw(`call sgp.sp_grupo_empleado_ins(:grupo_id,:empleado_id,1);`,{
            grupo_id: grupo_id, 
            empleado_id: empleado_id
        });
        const gruposAsociados = await knex.select("grupo_id").from("sgp.vw_grupo_empleados").where({
            registro_activo: true,
            grupo_id: grupo_id,
            empleado_id: empleado_id
        });
        for(let grupo in gruposAsociados){
            const id = gruposAsociados[grupo].grupo_id;
            const equipos = await knex.select("equipo_id").from("sgp.vw_grupos_equipos").where({
                grupo_id: id,
                registro_activo: true
            });
            for(let equipo in equipos){
                const deviceIn = await knex.select("*").from("sgp.vw_equipo_empleados").where({
                    equipo_id: equipos[equipo].equipo_id,
                    empleado_id
                });
                if(deviceIn.length === 0){
                    equiposToAsociate.push(equipos[equipo]);
                }
            }
        }
        let obj = {
            id: `${empleado_id}`,
            equipos: []
        }
        equiposToAsociate.map((equipo)=>{
            obj.equipos.push({
                id: `${equipo.equipo_id}`
            });
        });
        if(equiposToAsociate.length > 0){
            for(let equipo in equiposToAsociate){
                await knex.raw(`call sgp.sp_equipo_empleado_ins(
                    :equipo_id,
                    :empleado_id,
                    1
                );`,{
                    equipo_id: equiposToAsociate[equipo].equipo_id,
                    empleado_id: req.body.empleado_id
                });
            }
        }
        await axios.post("http://127.0.0.1:9099",obj,{
            headers: {
                "x-action":"AgregarUsuario"
            }
        })
        res.status(200).json({msg: "ok"});
    }catch(e){
        console.log(e);
        res.status(500).json({msg: "Hubo un error al asociar el grupo al empleado"});
    }
}
const borrarGrupoAsociado = async (req,res) => {
    let obj = {
        id: "",
        equipos: []
    };
    try{
        const gruposAsociados = await knex.select("*").from("sgp.vw_grupo_empleados").where({
            registro_activo: true,
            grupo_empleado_id: req.params.id
        });
        obj.id = `${gruposAsociados[0].empleado_id}`;

        const equiposAsociados = await knex.select("equipo_id").from("sgp.vw_grupos_equipos").where({
            grupo_id: gruposAsociados[0].grupo_id,
            registro_activo: true
        });
        equiposAsociados.forEach((equipo)=>{
            console.log("Equipo = " + equipo);
            obj.equipos.push({
                id: `${equipo.equipo_id}`
            });
        });
        for(let equipos in equiposAsociados){
            await knex("sgp.equipo_empleados").where({
                equipo_id: equiposAsociados[parseInt(equipos)].equipo_id,
                empleado_id: gruposAsociados[0].empleado_id
            }).del();
        }
        await knex.raw(`call sgp.sp_grupo_empleado_del(${req.params.id},1);`);
        await axios.post("http://127.0.0.1:9099",obj,{
            headers: {
                "x-action":"QuitarUsuario"
            }
        });
        res.status(200).json({msg: "ok"});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al borrar el grupo asociado"});
    }
}
const gruposController = {
    asociarGrupo,
    borrarGrupoAsociado,
    getGruposAsociados,
    getGrupos,
    getGrupoById,
    addGroup,
    addGrupoEquipo,
    updateGroup,
    deleteGroup,
    deleteGrupoEquipo
}

module.exports = {gruposController};