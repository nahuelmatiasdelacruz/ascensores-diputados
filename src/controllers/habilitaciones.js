const dayjs = require('dayjs');
const { knex } = require('../helpers/knexConfig');
const { syncDevices } = require('./controllerHelpers');
const { quitarEmpleadoEquipos } = require('../helpers/generalHelpers');
const setEstado = (statusHabilitacion,statusRegistro) => {
  if(!statusRegistro){
    return 'INACTIVO';
  }else{
    return statusHabilitacion;
  }
}
const getToday = () => {
  const today = dayjs()
    .subtract(1, 'day')
    .hour(23)
    .minute(59)
    .second(59)
    .format('YYYY-MM-DDTHH:mm:ss');
  return today;
}
const isActiveHabilitacion = async (id) => {
  const result = await knex.select('*').from('sgp.vw_habilitaciones').where({
    registro_activo: true,
    empleado_id: id
  });
  if(result.length > 0){
    const datosFiltrados = result.filter((habilitacion)=>habilitacion.estado==='ACTIVO' || habilitacion.estado === 'PRECARGA');
    if(datosFiltrados.length > 0){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}
const getHabilitaciones = async (req,res) => {
    const {id} = req.params;
    const data = await knex.select('*').from('sgp.vw_habilitaciones').where({
      empleado_id: id
    }).orderByRaw('CASE WHEN fecha_hasta IS NULL THEN 0 ELSE 1 END, fecha_hasta DESC');
    if(data.length > 0){
      const parsed = data.map((habilitacion)=>{
        return {
          ...habilitacion,
          fecha_desde: formatDateOut(habilitacion.fecha_desde),
          fecha_hasta: formatDateOut(habilitacion.fecha_hasta),
          id: habilitacion.habilitacion_id,
          estado: setEstado(habilitacion.estado,habilitacion.registro_activo)
        }
      })
      return res.json(parsed);
    }else{
      return res.json([]);
    }
}
const inhabilitarEmpleado = async (req,res) => {
  try{
    const id = req.params.id;
    await knex('sgp.habilitaciones').where({empleado_id: id}).update({
      fecha_hasta: getToday()
    })
    await syncDevices(id);
    res.status(200).json({msg: 'Se ha inhabilitado correctamente al empleado'});
  }catch(e){
    console.log(e);
    res.status(500).json({msg: 'Hubo un error al inhabilitar el empleado'});
  }
}
const formatDateOut = (date) => {
  if(date){
    const dateFormatted = dayjs(date);
    return dateFormatted;
  }else{
    return null;
  }
}
const formatDateIn = (date) => {
  if(date){
    const dateFormatted = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    return dateFormatted;
  }else{
    return null;
  }
}
const addHabilitacion = async (req,res) => {
  const tieneHabilitacion = await isActiveHabilitacion(req.body.empleado_id);
  if(tieneHabilitacion){
    return res.status(400).json({msg: 'El empleado ya tiene una habilitación activa.\nDeshabilitela o eliminela para poder agregar otra'});
  }
  try{
    await knex.raw(`
      call sgp.sp_habilitacion_ins(
        :p_empleado_id,
        1,
        :p_habilitacion_tipo_id,
        :p_observaciones,
        :p_fecha_desde,
        :p_fecha_hasta,
        :p_sector_id,
        :p_turno_noche,
        :p_periodo_legislativo_id,
        1,
        NULL
      );
    `,{
      p_empleado_id: req.body.empleado_id,
      p_habilitacion_tipo_id: req.body.tipo.id,
      p_observaciones: req.body.observaciones || null,
      p_fecha_desde: formatDateIn(req.body.fechaDesde),
      p_fecha_hasta: formatDateIn(req.body.fechaHasta),
      p_sector_id: req.body.sector.id,
      p_periodo_legislativo_id: req.body.periodo_legislativo || 1,
      p_turno_noche: req.body.turno_noche || false
    });
    return res.status(200).json({msg: 'Habilitación agregada con éxito'});
  }catch(e){
    console.log(e.message);
    return res.status(400).json({msg: 'Error al agregar la habilitación', error: e.message});
  }
}
const updateHabilitacion = async (req,res) => {
  try{
    const habilitacion = await knex.select('*').from('sgp.vw_habilitaciones').where('habilitacion_id', req.body.habilitacion_id);
    const fechaHasta = req.body.fechaHasta ? dayjs(req.body.fechaHasta) : null;
    const hoy = dayjs();
    if((fechaHasta > hoy || !fechaHasta) && habilitacion[0].registro_activo === false) {
      await knex('sgp.habilitaciones').update({registro_activo: true}).where('habilitacion_id', req.body.habilitacion_id);
    }
    await knex.raw(`call sgp.sp_habilitacion_upd(
      :p_habilitacion_id,
      :p_habilitacion_tipo_id,
      :p_observaciones,
      :p_fecha_desde,
      :p_fecha_hasta,
      :p_sector_id,
      :p_turno_noche,
      :p_periodo_legislativo_id,
      1
    );
  `,{
    p_habilitacion_id: req.body.habilitacion_id,
    p_habilitacion_tipo_id: req.body.tipo.id,
    p_observaciones: req.body.observaciones || null,
    p_fecha_desde: formatDateIn(req.body.fechaDesde),
    p_fecha_hasta: formatDateIn(req.body.fechaHasta),
    p_sector_id: req.body.sector.id,
    p_turno_noche: req.body.turno_noche || false,
    p_periodo_legislativo_id: req.body.periodo_legislativo || 1
  });
  await syncDevices(habilitacion[0].empleado_id);
  res.status(200).json({msg: 'ok'});
  }catch(e){
    console.log(e.message);
    res.status(400).json({msg: 'Hubo un error al actualizar la habilitación: ', error: e.message});
  }
}
const deleteHabilitacion = async (req,res) => {
  try{
    const user = await knex.select('*').from('sgp.vw_habilitaciones').where({habilitacion_id: req.params.id});
    await knex('sgp.habilitaciones').where('habilitacion_id','=',req.params.id).update({fecha_hasta: getToday()});
    await quitarEmpleadoEquipos(user[0].empleado_id);
    res.status(200).json({msg: 'Habilitacion eliminada con éxito'});
  }catch(e){
    res.status(400).json({msg: 'Error al borrar la habilitacion', error: e.message});
  }
}
const habilitacionesController = {
    inhabilitarEmpleado,
    getHabilitaciones,
    addHabilitacion,
    updateHabilitacion,
    deleteHabilitacion
}

module.exports = {habilitacionesController};