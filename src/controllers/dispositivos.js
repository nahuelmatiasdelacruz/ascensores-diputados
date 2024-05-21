const { knex } = require('../helpers/knexConfig');
const { syncDevices } = require('./controllerHelpers');
const { executeServiceFunction } = require('../helpers/externalServiceHelpers');
const { devicesQueries } = require('../constants/devicesControllersQueries');

const getTiposEquipos = async (req, res) => {
  try {
    const data = await knex.select('*').from('sgp.equipo_tipos').where({ registro_activo: true });
    res.json(data);
  } catch (e) {
    res.status(400).json({ msg: 'failed' });
  }
};
const getDispositivos = async (req, res) => {
  try {
    const data = await knex.select('*').from('sgp.equipos').where('registro_activo', true);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(500).json({ msg: 'Hubo un error en la lectura de la base de datos' });
  }
};
const getTarjetas = async (req, res) => {
  try {
    const tarjetas = await knex.select('*').from('sgp.tarjetas').where({ empleado_id: req.params.id, registro_activo: true });
    const parsed = tarjetas.map((tarjeta) => {
      return {
        ...tarjeta,
        id: tarjeta.tarjeta_id,
      };
    });
    res.json(parsed);
  } catch (e) {
    res
      .status(400)
      .json({
        msg: 'Hubo un error en la lectura de la base de datos',
        error: e.message,
      });
  }
};
const deleteDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    await knex.raw(devicesQueries.DELETE_DEVICE,{id});
    res.status(200).json({ msg: 'ok' });
  } catch (e) {
    res.status(400).json({ msg: 'Hubo un error', detail: e.message });
  }
};
const addDispositivo = async (req, res) => {
  const {nombre,ip,puerto,usuario,password,tipo,marca,modelo,nro_serie} = req.body;
  const result = await knex.raw(devicesQueries.ADD_DEVICE,{nombre,ip,puerto,usuario,password,tipo,marca,modelo,nro_serie});
  res.status(200).json({ msg: 'ok', result });
};

const sincronizarDispositivo = async (req, res) => {
  const {id} = req.body;
  const result = await knex.raw(devicesQueries.GET_DEVICES_TO_SYNC,{id});
  let obj = {
    equipo: `${id}`,
    rows: [],
  };
  result.rows.map((equipo) => {
    obj.rows.push(`${equipo.empleado_id}`);
  });
  await executeServiceFunction(obj,'AltaPorEQUIPO');
  res.status(200).json({ msg: 'ok', result });
};

const getEstadoDispositivo = async (req, res) => {
  const {id} = req.body;
  await executeServiceFunction({id},'EquipoEstaConectado');
  res.status(200).json({ msg: 'ok' });
};
const updateDispositivo = async (req, res) => {
  const {id,nombre,ip,puerto,usuario,password,tipo,marca,modelo,nro_serie} = req.body;
  try {
    await knex.raw(devicesQueries.UPDATE_DEVICE,{id,nombre,ip,puerto,usuario,password,tipo,marca,modelo,nro_serie});
    res.status(200).json({ msg: 'ok' });
  } catch (e) {
    res.status(500).json({ msg: 'Hubo un error', error: e.message });
  }
};
const addTarjeta = async (req, res) => {
  const {empleado_id,numero,observaciones = null,fromDate,toDate} = req.body;
  try {
    await knex.raw(devicesQueries.ADD_CARD,{empleado_id,numero,observaciones,fromDate,toDate});
    res.status(200).json({});
  } catch (e) {
    return res.status(500).json({ msg: 'Hubo un error al agregar la tarjeta', error: e.message });
  }
};
const getEquiposAsociados = async (req, res) => {
  const { id } = req.params;
  try {
    let asociados = [];
    let disponibles = [];
    const equipos_asociados = await knex.raw(devicesQueries.GET_EMPLOYEES_DEVICES_DATA,{id});
    const result_disponibles = await knex.raw(devicesQueries.GET_AVAILABLE_DEVICES,{id});
    disponibles = result_disponibles.rows.map((equipo) => {
      return {
        label: equipo.descripcion,
        id: equipo.id,
      };
    });
    asociados = equipos_asociados.rows.map((equipo) => {
      return {
        ...equipo,
        id: equipo.equipo_id,
      };
    });
    res.json({asociados, disponibles});
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ msg: 'Hubo un error al buscar los equipos', error: e.message });
  }
};
const asociarEquipo = async (req, res) => {
  const {equipo_id,empleado_id} = req.body;
  try {
    await knex.raw(devicesQueries.ASOCIATE_DEVICE_TO_USER,{equipo_id, empleado_id});
    await syncDevices(empleado_id);
    res.status(200).json({ msg: 'ok' });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ msg: 'Hubo un error al asociar el equipo al empleado' });
  }
};
const borrarEquipoAsociado = async (req, res) => {
  const { equipo_asociado_id: equipo_empleado_id , empleado_id, equipo_id } = req.params;
  try {
    await knex.raw(devicesQueries.DELETE_ASOCIATED_DEVICE,{equipo_empleado_id});
    const obj = {
      id: `${empleado_id}`,
      equipos: [{ id: `${equipo_id}` }],
    }
    await executeServiceFunction(obj,'QuitarUsuario');
    res.status(200).json({ msg: 'ok' });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ msg: e.message });
  }
};
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
  sincronizarDispositivo,
  getEstadoDispositivo,
  updateDispositivo,
};

module.exports = { dispositivosController };
