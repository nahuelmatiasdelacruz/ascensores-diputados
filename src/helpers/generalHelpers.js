const axios = require('axios');
const { knex } = require('./knexConfig');

const quitarEmpleadoEquipos = async (id) => {
    const equipos = await knex.select('*').from('sgp.vw_equipo_empleados').where({empleado_id: id});
    if(equipos.length > 0){
        const parsedEquipos = equipos.map(equipo=>{
            return {
                id: `${equipo.equipo_id}`
            }
        })
        let obj = {
            id: `${id}`,
            equipos: parsedEquipos
        }
        const responseBorrar = await axios.post('http://127.0.0.1:9099',
            obj,
            {
                headers: {
                    'x-action':'QuitarUsuario'
                }
            }
        );
        if(responseBorrar.data.Response === 'ERROR'){
            console.log('Hubo un error al borrar el empleado de los equipos asociados: ');
            console.log(responseBorrar.data);
        }
    }
}

module.exports = {quitarEmpleadoEquipos};