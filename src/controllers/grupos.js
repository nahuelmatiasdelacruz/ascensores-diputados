const { knex } = require('../helpers/knexConfig');
const { executeServiceFunction } = require('../helpers/externalServiceHelpers');
const { groupQueries } = require('../constants/groupControllersQueries');

const getGrupos = async (req,res)=>{
    try{
        const data = await knex.select('*').from('sgp.grupos').where('registro_activo',true);
        const gruposEquipos = await knex.select('*').from('sgp.grupo_equipos').where('registro_activo',true);
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
        res.status(500).json({msg: 'Hubo un error al buscar los grupos'});
    }
}
const getGrupoById = async (req, res) => {
  try {
      const { id } = req.params;
      const [equiposFiltrados, equiposAsociados] = await knex.raw(groupQueries.GET_GROUP_BY_ID, [id, id]);
      res.json({
          equiposFiltrados: equiposFiltrados.rows,
          equiposAsociados: equiposAsociados.rows
      });
  } catch (e) {
      console.log(e.message);
      res.status(400).json({ msg: 'Hubo un error', error: e.message });
  }
};
const addGroup = async (req,res)=>{
    try{
        const {nombre}= req.body;
        await knex.raw(groupQueries.ADD_GROUP,{nombre});
        res.status(200).json({msg: 'ok'});
    }catch(e){
        res.status(400).json({msg: 'error', error: e.message});
    }
}
const addGrupoEquipo = async (req,res)=>{
    try{
        const {equipo_id,grupo_id} = req.body;
        await knex.raw(groupQueries.ADD_DEVICE_GROUP,{equipo_id,grupo_id});
        await knex('sgp.equipo_empleados').insert(parsed);
        res.status(200).json({msg: 'ok'});
    }catch(e){
        console.log(e.message);
        res.status(400).json({msg: 'Hubo un error al agregar el equipo al grupo', error: e.message});
    }
}
const updateGroup = async (req,res)=>{
  const {grupo_id,nuevoNombre} = req.body;
  try{
      await knex.raw(groupQueries.RENAME_GROUP,{grupo_id,nuevoNombre});
      res.status(200).json({msg: 'Ok'});
  }catch(e){
      res.status(400).json({msg: 'Error', error: e.message});
  }
}
const deleteGroup = async (req,res)=>{
  const {id} = req.params;
    try{
        await knex.raw(groupQueries.DELETE_GROUP,{id});
        res.status(200).json({msg: 'ok'});
    }catch(e){
        res.status(400).json({msg: 'Hubo un error al borrar el grupo',error: e.message});
    }
}
const deleteGrupoEquipo = async(req,res)=>{
  const {id} = req.params;
  try{
      await knex.raw(groupQueries.REMOVE_DEVICE_GROUP,{id});
      await knex('sgp.equipo_empleados').where('equipo_id',id).del();
      res.status(200).json({msg: 'Se ha borrado el equipo correctamente'});
  }catch(e){
      res.status(400).json({msg: 'Hubo un error al borrar el equipo', error: e.message});
      console.log(e.message);
  }
}
const getGruposAsociados = async(req,res)=>{
    const {id} = req.params;
    try{
      const [gruposDisponibles, gruposAsociados] = await knex.raw(groupQueries.GET_ASOCIATED_GROUPS, [id, id]);
      res.json({
          asociados: gruposAsociados.rows,
          disponibles: gruposDisponibles.rows
      });
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: 'Hubo un error al buscar los grupos', error: e.message});
    }
}
const asociarGrupo = async (req,res) => {
    let equiposToAsociate = [];
    const {grupo_id, empleado_id} = req.body;
    try{
        await knex.raw(groupQueries.ASOCIATE_GROUP,{grupo_id,empleado_id});
        const gruposAsociados = await knex.select('grupo_id').from('sgp.vw_grupo_empleados').where({
            registro_activo: true,
            grupo_id,
            empleado_id
        });
        for(let grupo in gruposAsociados){
            const id = gruposAsociados[grupo].grupo_id;
            const equipos = await knex.select('equipo_id').from('sgp.vw_grupos_equipos').where({
                grupo_id: id,
                registro_activo: true
            });
            for(let equipo in equipos){
                const deviceIn = await knex.select('*').from('sgp.vw_equipo_empleados').where({
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
                await knex.raw(groupQueries.ADD_DEVICE_EMPLOYEE_RELATION,{
                    equipo_id: equiposToAsociate[equipo].equipo_id,
                    empleado_id: req.body.empleado_id
                  });
            }
        }
        await executeServiceFunction(obj,'AgregarUsuario');
        res.status(200).json({msg: 'ok'});
    }catch(e){
        console.log(e);
        res.status(500).json({msg: 'Hubo un error al asociar el grupo al empleado'});
    }
}
const borrarGrupoAsociado = async (req,res) => {
  const {id} = req.params;
    let obj = {
        id: '',
        equipos: []
    };
    try{
        const gruposAsociados = await knex.select('*').from('sgp.vw_grupo_empleados').where({
            registro_activo: true,
            grupo_empleado_id: req.params.id
        });
        obj.id = `${gruposAsociados[0].empleado_id}`;

        const equiposAsociados = await knex.select('equipo_id').from('sgp.vw_grupos_equipos').where({
            grupo_id: gruposAsociados[0].grupo_id,
            registro_activo: true
        });
        equiposAsociados.forEach((equipo)=>{
            obj.equipos.push({
                id: `${equipo.equipo_id}`
            });
        });
        for(let equipos in equiposAsociados){
            await knex('sgp.equipo_empleados').where({
                equipo_id: equiposAsociados[parseInt(equipos)].equipo_id,
                empleado_id: gruposAsociados[0].empleado_id
            }).del();
        }
        await knex.raw(groupQueries.DELETE_EMPLOYEE_FROM_GROUP,{id});
        await executeServiceFunction(obj,'QuitarUsuario');
        res.status(200).json({msg: 'ok'});
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: 'Hubo un error al borrar el grupo asociado'});
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