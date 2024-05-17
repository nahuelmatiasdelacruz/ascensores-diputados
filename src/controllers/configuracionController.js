const { knex } = require('../helpers/knexConfig');
const axios = require('axios');

const getPeriodos = async (req,res) => {
    try{
        const periodos = await knex.select('*').from('sgp.periodos_legislativos');
        res.json(periodos);
    }catch(e){
        console.log(e);
        return res.status(500).json({msg: 'Hubo un error al buscar los periodos'});
    }
}

const addPeriodo = async (req,res) => {
    //try{
    //    await knex.raw('call sgp.periodos_legislativos_ins')
    //}catch(e){
    //    console.log(e);
    //    return res.status(500).json({msg: 'Hubo un error al agregar el periodo'});
    //}
}

const deletePeriodo = async (req,res) => {

}

const updatePeriodo = async (req,res) => {

}

const configuracionController = {
    getPeriodos,
    addPeriodo,
    deletePeriodo,
    updatePeriodo
}

module.exports = {configuracionController}