const { executeServiceFunction } = require('../helpers/externalServiceHelpers');
const { knex } = require('../helpers/knexConfig');
const dayjs = require('dayjs');
const { formatDateIn, formatDateOut } = require('./controllerHelpers');
const { employeeQueries } = require('../constants/employeeControllersQueries');
require('dayjs/locale/es');
dayjs.locale('es');

const getPhotoById = async (req, res) => {
  try {
    const photo = await knex
      .select('*')
      .from('sgp.reconocimientos_faciales')
      .where('empleado_id', req.params.id);
    res.json(photo);
  } catch (e) {
    res.json({ error: e.message });
  }
};
const getEmpleados = async (req, res) => {
  try {
    const data = await knex
      .select('*')
      .from('sgp.vw_empleados')
      .where('registro_activo', true);
    const dataConHabilitacion = await Promise.all(
      data.map(async (empleado) => {
        const data = await knex
          .select('habilitacion_tipo', 'sector', 'turno_noche')
          .from('sgp.vw_habilitaciones')
          .where({
            empleado_id: empleado.empleado_id
          });
        if (data.length > 0) {
          const parsed = {
            ...data[0],
            ...empleado,
            turno_noche: data[0].turno_noche ? 'Si' : 'No',
            id: empleado.empleado_id,
          };
          return parsed;
        } else {
          const parsed = {
            ...empleado,
            turno_noche: 'No',
            id: empleado.empleado_id,
          };
          return parsed;
        }
      })
    );
    res.status(200).json(dataConHabilitacion);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ msg: 'Hubo un error en la lectura de la base de datos' });
  }
};
const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await knex.select('*').from('sgp.vw_empleados').where({
      registro_activo: true,
      empleado_id: req.params.id,
    });
    res.json(empleado[0]);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: 'error' });
  }
};
const changePhoto = async (req, res) => {
  const { foto, userId } = req.body;
  try {
    await knex('sgp.reconocimientos_faciales').where('empleado_id',userId).del();
    const profilephoto = JSON.stringify(foto);
    await knex.raw(employeeQueries.ADD_FACIAL_RECOGNITION_IMAGE,{id_empleado: userId, profilephoto});
    res.status(200).json({});
  } catch (e) {
    console.log(e.messsage);
    res.status(500).json({msg: 'Hubo un error al cambiar la foto', error: e.message});
  }
};
const addEmpleado = async (req, res) => {
  let {documento,apellido,nombre,tipo_carga,documento_tipo_id,sexo_id,numero_tramite = null, ejemplar = null, fecha_nacimiento = null,fecha_emision = null,cuil = null,correo = null,telefono = null} = req.body;
  const {tipo,observaciones: obs = null,fechaDesde = null,fechaHasta = null,p_turno_noche = false,sector,periodo_legislativo = 1} = req.body.habilitacion;
  const result = await knex.select('*').from('sgp.vw_empleados').where({documento,registro_activo: true});
  const {p_empleado_id: id_empleado} = result.rows[0];
  if (result.length > 0) return res.status(400).json({ msg: 'El empleado ya existe en la base de datos'})
  try {
    await knex.raw(employeeQueries.ADD_EMPLOYEE,{apellido,nombre,tipo_carga,documento_tipo_id,documento,sexo_id,numero_tramite,ejemplar,fecha_nacimiento: formatDateIn(fecha_nacimiento) || null,fecha_emision: formatDateIn(fecha_emision) || null,cuil,correo,telefono,observaciones});
    const profilephoto = JSON.stringify(data.profilePhoto);
    if (profilephoto) {
      await knex.raw(employeeQueries.ADD_FACIAL_RECOGNITION_IMAGE,{id_empleado,profilephoto});
    }
    await knex.raw(employeeQueries.ADD_HABILITATION,
      {
        id_empleado,
        id_tipo_hab: tipo.id,
        obs,
        desde: formatDateIn(fechaDesde) || null,
        hasta: formatDateIn(fechaHasta) || null,
        p_turno_noche,
        sector_id: sector.id,
        periodo_legislativo
      }
    );
    res.status(200).json({
        msg: 'Empleado agregado correctamente',
        id: id_empleado,
      });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: 'Hubo un error al agregar el empleado', error: e.message });
  }
};
const updateEmpleado = async (req, res) => {
  const {empleado_id,apellido,nombre,tipo_carga,documento_tipo_id,documento,sexo_id,numero_tramite,ejemplar,fecha_nacimiento,fecha_emision,cuil,email,telefono,observaciones} = req.body;
  try{
    await knex.raw(employeeQueries.UPDATE_EMPLOYEE,{empleado_id,apellido,nombre,tipo_carga,documento_tipo_id,documento,sexo_id,numero_tramite,ejemplar,fecha_nacimiento,fecha_emision,cuil,email,telefono,observaciones});
    res.status(200).json({msg: 'ok'});
  }catch(e){
    console.log(e);
    res.status(500).json({msg: 'Hubo un error al actualizar el empleado'});
  }
};
const deleteEmpleado = async (req, res) => {
  const {id} = req.params;
  try {
    await knex.raw(employeeQueries.DELETE_EMPLOYEE,{id});
    const equiposAsociados = await knex
            .select('sgp.equipo_empleados.*', 'sgp.vw_equipos.descripcion')
            .from('sgp.equipo_empleados')
            .join('sgp.vw_equipos', 'sgp.equipo_empleados.equipo_id', 'sgp.vw_equipos.equipo_id')
            .where({
              'sgp.equipo_empleados.registro_activo': true,
              'sgp.equipo_empleados.empleado_id': id
            });
    let obj = {
      id: `${id}`,
      equipos: []
    }
    obj.equipos = equiposAsociados.map((equipo)=>{
      return {
        equipo_id: `${equipo.equipo_id}`,
      }
    });
    await executeServiceFunction(obj,'QuitarUsuario');
    res.status(200).json({ msg: 'ok' });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: 'Hubo un error', error: e.message });
  }
};
const getSectores = async (req, res) => {
  try {
    const data = await knex
      .select('*')
      .from('sgp.sectores')
      .where('registro_activo', true);
    const parsed = data.map((sector) => {
      return {
        id: sector.sector_id,
        label: sector.descripcion,
      };
    });
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ msg: 'Hubo un error', error: e.message });
  }
};
const getTipos = async (req, res) => {
  try {
    const result = await knex.select('*').from('sgp.habilitacion_tipos').where('registro_activo', true);
    const parsed = result.map((tipo) => {
      return {
        id: tipo.habilitacion_tipo_id,
        label: tipo.descripcion,
      };
    });
    return res.json(parsed);
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({
        msg: 'Hubo un error al buscar los tipos en la base de datos',
        error: e.message,
      });
  }
};
const getEmpleadosFiltro = async (req, res) => {
  const {estado} = req.params;
  let empleadosQuery;
  if(!estado){
    return res.status(400).json({msg: 'Debe pasar el valor de estado'});
  }
  try{
    if(estado === 'ALL'){
      empleadosQuery = await knex.raw(employeeQueries.SELECT_ALL_EMPLOYEES);
    }else{
      empleadosQuery = await knex.raw(employeeQueries.SELECT_EMPLOYEES_BY_STATE,{estado});
    }
    const parsed = empleadosQuery.rows.map((empleado) => {
      return {
        ...empleado,
        fecha_nacimiento: formatDateOut(empleado.fecha_nacimiento),
        fecha_emision: formatDateOut(empleado.fecha_emision),
        id: empleado.empleado_id,
      };
    });
    return res.json(parsed);
  }catch(e){
    console.log(e.message);
    return res.status(400).json({msg: 'Hubo un error al buscar los archivos en la base de datos'});
  }
};
const empleadosController = {
  getEmpleadosFiltro,
  getTipos,
  getSectores,
  getPhotoById,
  changePhoto,
  getEmpleados,
  getEmpleadoById,
  addEmpleado,
  updateEmpleado,
  deleteEmpleado,
};

module.exports = { empleadosController };
