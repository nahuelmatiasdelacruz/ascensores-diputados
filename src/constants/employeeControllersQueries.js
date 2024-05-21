const employeeQueries = {
  ADD_FACIAL_RECOGNITION_IMAGE: `call sgp.sp_reconocimiento_facial_ins(:id_empleado,1,'foto de perfil',:profilephoto,1,null)`,
  ADD_EMPLOYEE: `call sgp.sp_empleado_ins(:apellido, :nombre, :tipo_carga, :documento_tipo_id, :documento, :sexo_id, :numero_tramite, :ejemplar, :fecha_nacimiento, :fecha_emision, :cuil, :correo, :telefono, :observaciones, 1, null)`,
  ADD_HABILITATION: `call sgp.sp_habilitacion_ins(:id_empleado,1,:id_tipo_hab,:obs,:desde,:hasta,:sector_id,:p_turno_noche,:periodo_legislativo,1,null)`,
  UPDATE_EMPLOYEE: `CALL sgp.sp_empleado_upd(:empleado_id,:apellido,:nombre,:tipo_carga,:documento_tipo_id,:documento,:sexo_id,:numero_tramite,:ejemplar,:fecha_nacimiento,:fecha_emision,:cuil,:email,:telefono,:observaciones,1)`,
  DELETE_EMPLOYEE: `call sgp.sp_empleado_del(:id,1)`,
  SELECT_ALL_EMPLOYEES: `
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
      e.registro_activo`,
  SELECT_EMPLOYEES_BY_STATE: `
    SELECT
      e.*,
      COALESCE(SUM(CASE WHEN h.huella_id IS NOT NULL THEN 1 ELSE 0 END), 0) AS cantidad_datos_bio
    FROM
      sgp.vw_empleados e
    LEFT JOIN
      sgp.huellas h ON e.empleado_id = h.empleado_id AND h.registro_activo = true
    WHERE
      e.registro_activo = true AND e.estado = :estado
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
      e.registro_activo`,
};

module.exports = {employeeQueries};