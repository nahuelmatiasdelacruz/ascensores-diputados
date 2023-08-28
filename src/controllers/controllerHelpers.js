const axios = require('axios');
const { knex } = require('../helpers/knexConfig');

const syncDevices = async (id) => {
    let obj = {
        id: `${id}`,
        equipos: []
    }
    const data = await knex.select("*").from("sgp.vw_equipo_empleados").where({registro_activo: true,empleado_id: id});
    data.map((equipo)=>{
        obj.equipos.push({
            id: `${equipo.equipo_id}`
        });
    });
    try{
        if(obj.equipos.length > 0){
            const response = await axios.post("http://127.0.0.1:9099",obj,{
                headers: {
                    "x-action":"AgregarUsuario"
                }
            });
        }
    }catch(e){
        console.log(e.message);
    }
}

module.exports = {
    syncDevices
}