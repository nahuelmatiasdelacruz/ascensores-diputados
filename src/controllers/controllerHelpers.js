const axios = require('axios');
const { knex } = require('../helpers/knexConfig');

const syncDevices = async (id) => {
    let obj = {
        id: `${id}`,
        equipos: []
    }
    // const data = await knex.raw(`SELECT e.*, e.equipo_id AS id
    // FROM sgp.equipos e
    // INNER JOIN (
    //     SELECT ee.equipo_id
    //     FROM sgp.equipo_empleados ee
    //     WHERE ee.equipo_id IS NOT NULL AND ee.empleado_id = ${id}
    //     UNION
    //     SELECT ge.equipo_id
    //     FROM sgp.grupo_empleados gemp
    //     INNER JOIN sgp.grupo_equipos ge ON gemp.grupo_id = ge.grupo_id
    //     WHERE gemp.empleado_id = ${id}
    //     UNION
    //     SELECT eqe.equipo_id
    //     FROM sgp.empleados em
    //     INNER JOIN sgp.grupo_empleados gemp ON em.empleado_id = gemp.empleado_id
    //     INNER JOIN sgp.grupo_equipos ge ON gemp.grupo_id = ge.grupo_id
    //     INNER JOIN sgp.equipos eqe ON ge.equipo_id = eqe.equipo_id
    //     WHERE em.empleado_id = ${id}
    // ) AS equipos_asociados ON e.equipo_id = equipos_asociados.equipo_id
    // WHERE e.registro_activo <> false OR e.registro_activo IS NULL;
    // `);
    const data = await knex.raw(`
    SELECT e.*, e.equipo_id AS id, cc.equipo_empleado_id
        FROM sgp.equipos e
        inner JOIN (
            select equi.equipo_id from sgp.equipos equi where equi.equipo_id in(
            SELECT ee.equipo_id
            FROM sgp.equipo_empleados ee
            WHERE ee.equipo_id IS NOT NULL AND ee.empleado_id = ${id}
            union
            select ge.equipo_id from sgp.grupo_equipos ge 
            where grupo_id in 
            (select grupo_id from sgp.grupo_empleados e where empleado_id = ${id} and e.registro_activo = true) and ge.registro_activo  = true)
        ) AS equipos_asociados ON e.equipo_id = equipos_asociados.equipo_id
        inner join sgp.equipo_empleados cc on cc.equipo_id = e.equipo_id  and cc.empleado_id = ${id}
        WHERE e.registro_activo <> false OR e.registro_activo IS NULL and e.equipo_tipo_id != 4 
    `);
    data.rows.map((equipo)=>{
        obj.equipos.push({
            id: `${equipo.equipo_id}`
        });
    });
    const dataAd = await knex.raw(`
    select * from sgp.equipos equi where equi.equipo_id	in(
        SELECT ee.equipo_id
        FROM sgp.equipo_empleados ee
        WHERE ee.equipo_id IS NOT NULL AND ee.empleado_id = ${id}
        union
        select ge.equipo_id from sgp.grupo_equipos ge 
        where grupo_id in 
        (select grupo_id from sgp.grupo_empleados e where empleado_id = ${id} and e.registro_activo = true) and ge.registro_activo  = true) 
    `);
    dataAd.rows.map((equipo)=>{
        if(!obj.equipos.includes(`${equipo.equipo_id}`)){
            obj.equipos.push({
                id: `${equipo.equipo_id}`
            });
        }
    });
    try{
        if(obj.equipos.length > 0){
            const response = await axios.post("http://127.0.0.1:9099",obj,{
                headers: {
                    "x-action":"AgregarUsuario"
                }
            });
            console.log(response.data);
        }
    }catch(e){
        console.log(e.message);
    }
}

module.exports = {
    syncDevices
}