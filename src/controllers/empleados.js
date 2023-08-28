const { knex } = require("../helpers/knexConfig");
const dayjs = require("dayjs");
require("dayjs/locale/es");
dayjs.locale("es");

const getPhotoById = async (req, res) => {
  try {
    const photo = await knex
      .select("*")
      .from("sgp.reconocimientos_faciales")
      .where("empleado_id", req.params.id);
    res.json(photo);
  } catch (e) {
    res.json({ error: e.message });
  }
};
const getEmpleados = async (req, res) => {
  try {
    const data = await knex
      .select("*")
      .from("sgp.vw_empleados")
      .where("registro_activo", true);
    const dataConHabilitacion = await Promise.all(
      data.map(async (empleado) => {
        const data = await knex
          .select("habilitacion_tipo", "sector", "turno_noche")
          .from("sgp.vw_habilitaciones")
          .where({
            empleado_id: empleado.empleado_id
          });
        if (data.length > 0) {
          const parsed = {
            ...data[0],
            ...empleado,
            turno_noche: data[0].turno_noche ? "Si" : "No",
            id: empleado.empleado_id,
          };
          return parsed;
        } else {
          const parsed = {
            ...empleado,
            turno_noche: "No",
            id: empleado.empleado_id,
          };
          return parsed;
        }
      })
    );
    console.log(dataConHabilitacion[2]);
    res.status(200).json(dataConHabilitacion);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ msg: "Hubo un error en la lectura de la base de datos" });
  }
};
const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await knex.select("*").from("sgp.vw_empleados").where({
      registro_activo: true,
      empleado_id: req.params.id,
    });
    res.json(empleado[0]);
  } catch (e) {
    console.log(e);
    res.status(400).json({ msg: "error" });
  }
};
const changePhoto = async (req, res) => {
  const { foto, userId } = req.body;
  try {
    await knex("sgp.reconocimientos_faciales")
      .where("empleado_id", userId)
      .del();
    await knex.raw(
      `call sgp.sp_reconocimiento_facial_ins(${userId},1,'FotoPerfil','${JSON.stringify(
        foto
      )}',1,null);`
    );
  } catch (e) {
    console.log(e.messsage);
  }
  res.status(200).json({});
};
const addEmpleado = async (req, res) => {
  let data = req.body;
  console.log(data);
  const habilitacion = req.body.habilitacion;
  try {
    const result = await knex.select("*").from("sgp.vw_empleados").where({
      documento: data.documento,
      registro_activo: true,
    });
    if (result.length > 0) {
      return res
        .status(400)
        .json({ msg: "El empleado ya existe en la base de datos" });
    }
  } catch (e) {
    return res
      .status(500)
      .json({ msg: "Hubo un error al agregar el empleado", error: e.message });
  }
  try {
    const result = await knex.raw(
      `
    call sgp.sp_empleado_ins(
      :apellido, 
      :nombre, 
      :tipo_carga, 
      :documento_tipo_id, 
      :documento, 
      :sexo_id, 
      :numero_tramite, 
      :ejemplar, 
      :fecha_nacimiento, 
      :fecha_emision, 
      :cuil, 
      :correo, 
      :telefono, 
      :observaciones, 
      1, 
      null
    );
  `,
      {
        apellido: data.apellido,
        nombre: data.nombre,
        tipo_carga: data.tipo_carga,
        documento_tipo_id: data.documento_tipo_id,
        documento: data.documento,
        sexo_id: data.sexo_id,
        numero_tramite: data.numero_tramite || null,
        ejemplar: data.ejemplar || null,
        fecha_nacimiento: formatDateIn(data.fecha_nacimiento) || null,
        fecha_emision: formatDateIn(data.fecha_emision) || null,
        cuil: data.cuil || null,
        correo: data.correo || null,
        telefono: data.telefono || null,
        observaciones: data.observaciones || null,
      }
    );
    const profilePhoto = JSON.stringify(data.profilePhoto);
    if (profilePhoto) {
      await knex.raw(
        `call sgp.sp_reconocimiento_facial_ins(:id,1,'foto de perfil',:profilephoto,1,null);`,
        { id: result.rows[0].p_empleado_id, profilephoto: profilePhoto }
      );
    }
    await knex.raw(
      `call sgp.sp_habilitacion_ins(:id_empleado,1,:id_tipo_hab,:obs,:desde,:hasta,:sector_id,:p_turno_noche,:p_periodo_legislativo,1,null);`,
      {
        id_empleado: result.rows[0].p_empleado_id,
        id_tipo_hab: habilitacion.tipo.id,
        obs: habilitacion.observaciones || null,
        desde: formatDateIn(habilitacion.fechaDesde) || null,
        hasta: formatDateIn(habilitacion.fechaHasta) || null,
        p_turno_noche: habilitacion.p_turno_noche || false,
        sector_id: habilitacion.sector.id,
        p_periodo_legislativo: habilitacion.periodo_legislativo || 1
      }
    );
    res.status(200).json({
        msg: "Empleado agregado correctamente",
        id: result.rows[0].p_empleado_id,
      });
  } catch (e) {
    console.log(e.message);
    res
      .status(400)
      .json({ msg: "Hubo un error al agregar el empleado", error: e.message });
  }
};
const updateEmpleado = async (req, res) => {
  try{
    await knex.raw(`CALL sgp.sp_empleado_upd(
      :p_empleado_id,
      :p_apellido,
      :p_nombre,
      :p_tipo_carga,
      :p_documento_tipo_id,
      :p_documento,
      :p_sexo_id,
      :p_numero_tramite,
      :p_ejemplar,
      :p_fecha_nacimiento,
      :p_fecha_emision,
      :p_cuil,
      :p_email,
      :p_telefono,
      :p_observaciones,
      1
    );`,{
      p_empleado_id: req.body.empleado_id,
      p_apellido: req.body.apellido,
      p_nombre: req.body.nombre,
      p_tipo_carga: req.body.tipo_carga,
      p_documento_tipo_id: req.body.documento_tipo_id,
      p_documento: req.body.documento,
      p_sexo_id: req.body.sexo_id,
      p_numero_tramite: req.body.numero_tramite,
      p_ejemplar: req.body.ejemplar,
      p_fecha_nacimiento: req.body.fecha_nacimiento,
      p_fecha_emision: req.body.fecha_emision,
      p_cuil: req.body.cuil,
      p_email: req.body.email,
      p_telefono: req.body.telefono,
      p_observaciones: req.body.observaciones,
    });
    res.status(200).json({msg: "ok"});
  }catch(e){
    console.log(e);
    res.status(500).json({msg: "Hubo un error al actualizar el empleado"});
  }
};
const deleteEmpleado = async (req, res) => {
  const {id} = req.params;
  try {
    await knex.raw(`call sgp.sp_empleado_del(${id},1);`);
    const equiposAsociados = await knex
            .select("sgp.equipo_empleados.*", "sgp.vw_equipos.descripcion")
            .from("sgp.equipo_empleados")
            .join("sgp.vw_equipos", "sgp.equipo_empleados.equipo_id", "sgp.vw_equipos.equipo_id")
            .where({
              "sgp.equipo_empleados.registro_activo": true,
              "sgp.equipo_empleados.empleado_id": id
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
    console.log("Borrando usuario de los equipos: ");
    console.log(obj);
    const responseBorrar = await axios.post("http://127.0.0.1:9099",obj,
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
    res.status(200).json({ msg: "ok" });
  } catch (e) {
    console.log(e.message);
    res.status(400).json({ msg: "Hubo un error", error: e.message });
  }
};
const getSectores = async (req, res) => {
  try {
    const data = await knex
      .select("*")
      .from("sgp.sectores")
      .where("registro_activo", true);
    const parsed = data.map((sector) => {
      return {
        id: sector.sector_id,
        label: sector.descripcion,
      };
    });
    res.json(parsed);
  } catch (e) {
    res.status(500).json({ msg: "Hubo un error", error: e.message });
  }
};
const getTipos = async (req, res) => {
  try {
    const result = await knex
      .select("*")
      .from("sgp.habilitacion_tipos")
      .where("registro_activo", true);
    const parsed = result.map((tipo) => {
      return {
        id: tipo.habilitacion_tipo_id,
        label: tipo.descripcion,
      };
    });
    return res.json(parsed);
  } catch (e) {
    console.log(e.message);
    return res
      .status(500)
      .json({
        msg: "Hubo un error al buscar los tipos en la base de datos",
        error: e.message,
      });
  }
};
const getEmpleadosFiltro = async (req, res) => {
  const estado = req.params.estado;
  let result;
  let empleadosQuery;
  if(!estado){
    return res.status(400).json({msg: "Debe pasar el valor de estado"});
  }
  try{
    if(estado === "ALL"){
      empleadosQuery = await knex.raw(`
      SELECT
        e.*,
        COALESCE(SUM(CASE WHEN h.huella_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS cantidad_datos_bio
      FROM
        sgp.vw_empleados e
      LEFT JOIN
        sgp.huellas h ON e.empleado_id = h.empleado_id AND h.registro_activo = true
      WHERE
        e.registro_activo = true
      GROUP BY
        e.empleado_id,
        e.apellido,
        e.nombre,
        e.periodo_legislativo,
        e.documento_tipo_id,
        e.documento_tipo,
        e.documento,
        e.tipo_carga,
        e.sexo_id,
        e.sexo,
        e.numero_tramite,
        e.ejemplar,
        e.fecha_nacimiento,
        e.fecha_nacimiento_format,
        e.fecha_emision,
        e.fecha_emision_format,
        e.cuil,
        e.email,
        e.telefono,
        e.observaciones,
        e.estado,
        e.sector,
        e.habilitacion_tipo,
        e.registro_activo
    `);
      // empleadosQuery = knex
        // .select("sgp.vw_empleados.*")
        // .count("sgp.huellas.huella_id as cantidad_datos_bio")
        // .from("sgp.vw_empleados")
        // .leftOuterJoin("sgp.huellas","vw_empleados.empleado_id","sgp.huellas.empleado_id")
        // .where("vw_empleados.registro_activo",true)
        // //.andWhere("sgp.huellas.registro_activo",true)
        // .groupBy("vw_empleados.empleado_id","vw_empleados.apellido","vw_empleados.nombre","vw_empleados.periodo_legislativo","vw_empleados.documento_tipo_id","vw_empleados.documento_tipo","vw_empleados.documento","vw_empleados.tipo_carga","vw_empleados.sexo_id","vw_empleados.sexo","vw_empleados.numero_tramite","vw_empleados.ejemplar","vw_empleados.fecha_nacimiento","vw_empleados.fecha_nacimiento_format","vw_empleados.fecha_emision","vw_empleados.fecha_emision_format","vw_empleados.cuil","vw_empleados.email","vw_empleados.telefono","vw_empleados.observaciones","vw_empleados.estado","vw_empleados.sector","vw_empleados.habilitacion_tipo","vw_empleados.registro_activo");
    }else{
      empleadosQuery = await knex.raw(`
      SELECT
        e.*,
        COALESCE(SUM(CASE WHEN h.huella_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS cantidad_datos_bio
      FROM
        sgp.vw_empleados e
      LEFT JOIN
        sgp.huellas h ON e.empleado_id = h.empleado_id AND h.registro_activo = true
      WHERE
        e.registro_activo = true AND e.estado = '${estado}'
      GROUP BY
        e.empleado_id,
        e.apellido,
        e.nombre,
        e.periodo_legislativo,
        e.documento_tipo_id,
        e.documento_tipo,
        e.documento,
        e.tipo_carga,
        e.sexo_id,
        e.sexo,
        e.numero_tramite,
        e.ejemplar,
        e.fecha_nacimiento,
        e.fecha_nacimiento_format,
        e.fecha_emision,
        e.fecha_emision_format,
        e.cuil,
        e.email,
        e.telefono,
        e.observaciones,
        e.estado,
        e.sector,
        e.habilitacion_tipo,
        e.registro_activo
    `);
      // empleadosQuery = knex
        // .select("sgp.vw_empleados.*")
        // .count("sgp.huellas.huella_id as cantidad_datos_bio")
        // .from("sgp.vw_empleados")
        // .leftOuterJoin("sgp.huellas","vw_empleados.empleado_id","sgp.huellas.empleado_id")
        // .where("vw_empleados.registro_activo",true)
        // //.andWhere("sgp.huellas.registro_activo",true)
        // .andWhere("vw_empleados.estado",estado)
        // .groupBy("vw_empleados.empleado_id","vw_empleados.apellido","vw_empleados.nombre","vw_empleados.periodo_legislativo","vw_empleados.documento_tipo_id","vw_empleados.documento_tipo","vw_empleados.documento","vw_empleados.tipo_carga","vw_empleados.sexo_id","vw_empleados.sexo","vw_empleados.numero_tramite","vw_empleados.ejemplar","vw_empleados.fecha_nacimiento","vw_empleados.fecha_nacimiento_format","vw_empleados.fecha_emision","vw_empleados.fecha_emision_format","vw_empleados.cuil","vw_empleados.email","vw_empleados.telefono","vw_empleados.observaciones","vw_empleados.estado","vw_empleados.sector","vw_empleados.habilitacion_tipo","vw_empleados.registro_activo");
    }
    //result = await empleadosQuery;
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
    return res.status(400).json({msg: "Hubo un error al buscar los archivos en la base de datos"});
  }
};
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
    const dateFormatted = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    return dateFormatted;
  }else{
    return null;
  }
}
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
