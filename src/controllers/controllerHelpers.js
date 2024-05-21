const { knex } = require('../helpers/knexConfig');
const { executeServiceFunction } = require('../helpers/externalServiceHelpers');
const { helpersQueries } = require('../constants/controllersHelpersQueries');

const syncDevices = async (id) => {
    let obj = {
        id: `${id}`,
        equipos: []
    }
    const data = await knex.raw(helpersQueries.SELECT_DEVICES_TO_SYNC,{id});
    data.rows.map((equipo)=>{
        obj.equipos.push({
            id: `${equipo.equipo_id}`
        });
    });
    const dataAd = await knex.raw(helpersQueries.SELECT_ASOCIATED_DEVICES,{id});
    dataAd.rows.map((equipo)=>{
        if(!obj.equipos.includes(`${equipo.equipo_id}`)){
            obj.equipos.push({
                id: `${equipo.equipo_id}`
            });
        }
    });
    if(obj.equipos.length > 0){
      await executeServiceFunction(obj,'AgregarUsuario');
    }
}
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
    const dateFormatted = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    return dateFormatted;
  }else{
    return null;
  }
}
module.exports = {
    syncDevices,
    formatDateIn,
    formatDateOut
}