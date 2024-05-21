const devicesQueries = {
  GET_DEVICES_TO_SYNC: `select e.empleado_id from sgp.empleados e where empleado_id  in (select empleado_id from sgp.equipo_empleados ee where ee.equipo_id = :id and ee.registro_activo = true)`,
  UPDATE_DEVICE: `call sgp.sp_equipo_upd(:id,1,:nombre,:id,:puerto,:usuario,:password,:tipo,1,:marca,:modelo,:nro_serie,1)`,
  ADD_CARD: `call sgp.sp_tarjeta_ins(:empleado_id,1,:numero,:observaciones,:fromDate,:toDate,false,1,null)`,
  ADD_DEVICE: `call sgp.sp_equipo_ins(19, :nombre, :ip, :puerto, :usuario, :password, :tipo,1, :marca, :modelo, :nro_serie,1,null)`,
  DELETE_DEVICE: `call sgp.sp_equipo_del(:id,1)`,
  GET_AVAILABLE_DEVICES: `SELECT e.equipo_id as id, descripcion FROM sgp.equipos e LEFT JOIN sgp.equipo_empleados ee ON e.equipo_id = ee.equipo_id AND ee.empleado_id = :id WHERE e.registro_activo = true AND ee.empleado_id IS NULL`,
  GET_EMPLOYEES_DEVICES_DATA: `select distinct empleado_id, equipo_id
  from (
      select ee.empleado_id,  ee.equipo_id 
      from sgp.equipo_empleados ee
      where ee.registro_activo = true
      union all
      select gru_emp.empleado_id, gru_equ.equipo_id 
      from sgp.grupo_empleados gru_emp
      join sgp.grupos gru on (gru_emp.grupo_id = gru.grupo_id and gru.registro_activo = true)
      join sgp.grupo_equipos gru_equ on (gru_emp.grupo_id = gru_equ.grupo_id and gru_equ.registro_activo = true) 
      where gru_emp.registro_activo = true
  )
  where empleado_id = :id`,
  ASOCIATE_DEVICE_TO_USER: `call sgp.sp_equipo_empleado_ins(:equipo_id,:empleado_id,1)`,
  DELETE_ASOCIATED_DEVICE: `call sgp.sp_equipo_empleado_del(:equipo_empleado_id,1)`,
};

module.exports = {devicesQueries};