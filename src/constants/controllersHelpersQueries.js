const helpersQueries = {
  SELECT_DEVICES_TO_SYNC: `
    SELECT e.*, e.equipo_id AS id, cc.equipo_empleado_id
    FROM sgp.equipos e
    inner JOIN (
    select equi.equipo_id from sgp.equipos equi where equi.equipo_id in(
    SELECT ee.equipo_id
    FROM sgp.equipo_empleados ee
    WHERE ee.equipo_id IS NOT NULL AND ee.empleado_id = :id
    union
    select ge.equipo_id from sgp.grupo_equipos ge 
    where grupo_id in 
    (select grupo_id from sgp.grupo_empleados e where empleado_id = :id and e.registro_activo = true) and ge.registro_activo  = true)
    ) AS equipos_asociados ON e.equipo_id = equipos_asociados.equipo_id
    inner join sgp.equipo_empleados cc on cc.equipo_id = e.equipo_id  and cc.empleado_id = :id
    WHERE e.registro_activo <> false OR e.registro_activo IS NULL and e.equipo_tipo_id != 4 
  `,
  SELECT_ASOCIATED_DEVICES: `
    select * from sgp.equipos equi where equi.equipo_id	in(
        SELECT ee.equipo_id
        FROM sgp.equipo_empleados ee
        WHERE ee.equipo_id IS NOT NULL AND ee.empleado_id = :id
        union
        select ge.equipo_id from sgp.grupo_equipos ge 
        where grupo_id in 
        (select grupo_id from sgp.grupo_empleados e where empleado_id = :id and e.registro_activo = true) and ge.registro_activo = true)
  `,
};

module.exports = {helpersQueries};