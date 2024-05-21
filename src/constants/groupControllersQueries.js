const groupQueries = {
  GET_GROUP_BY_ID: `
  WITH equipos_asociados AS (
      SELECT *, equipo_id AS id
      FROM sgp.vw_grupos_equipos
      WHERE grupo_id = ? AND registro_activo = true
  ),
  all_devices AS (
      SELECT equipo_id AS id, descripcion AS label
      FROM sgp.equipos
      WHERE registro_activo = true
  )
  SELECT ad.id, ad.label
  FROM all_devices ad
  LEFT JOIN equipos_asociados ea ON ad.id = ea.equipo_id
  WHERE ea.equipo_id IS NULL;

  SELECT *, equipo_id AS id
  FROM sgp.vw_grupos_equipos
  WHERE grupo_id = ? AND registro_activo = true;
`,
  ADD_GROUP: `call sgp.sp_grupo_ins(:nombre,1,null)`,
  ADD_DEVICE_GROUP: `call sgp.sp_grupo_equipo_ins(:grupo_id,:equipo_id,1)`,
  RENAME_GROUP: `call sgp.sp_grupo_upd(:grupo_id,:nuevoNombre,1)`,
  DELETE_GROUP: `call sgp.sp_grupo_del(:id,1)`,
  REMOVE_DEVICE_GROUP: `call sgp.sp_grupo_equipo_del(:id,1)`,
  GET_ASOCIATED_GROUPS: `
    WITH grupos_asociados AS (
        SELECT *, grupo_empleado_id AS id
        FROM sgp.vw_grupo_empleados
        WHERE registro_activo = true AND empleado_id = ?
    )
    SELECT
        g.grupo_id AS id,
        g.descripcion AS label
    FROM sgp.grupos g
    WHERE g.registro_activo = true
      AND g.grupo_id NOT IN (SELECT grupo_id FROM grupos_asociados);

    SELECT *, grupo_empleado_id AS id
    FROM sgp.vw_grupo_empleados
    WHERE registro_activo = true AND empleado_id = ?;
  `,
  ASOCIATE_GROUP: `call sgp.sp_grupo_empleado_ins(:grupo_id,:empleado_id,1)`,
  ADD_DEVICE_EMPLOYEE_RELATION: `call sgp.sp_equipo_empleado_ins(:equipo_id,:empleado_id,1)`,
  DELETE_EMPLOYEE_FROM_GROUP: `call sgp.sp_grupo_empleado_del(:id,1)`
}

module.exports = {groupQueries};