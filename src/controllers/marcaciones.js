const { knex } = require("../helpers/knexConfig");
const axios = require("axios");
const dayjs = require("dayjs");

const getMarcaciones = async (req,res) => {
    try{
        const marcaciones = await knex.select("*").from("sgp.vw_eventos").orderBy("fecha","desc");
        let marcacionesWithData = [];
        for(let marcacion in marcaciones){
            const dataEmpleado = await knex.select("*").from("sgp.vw_empleados").where({
                estado: "ACTIVO",
                empleado_id: marcaciones[marcacion].empleado_id
            })
            if(dataEmpleado.length > 0){
                marcacionesWithData.push({
                    ...marcaciones[marcacion],
                    apellido: dataEmpleado[0].apellido,
                    nombre: dataEmpleado[0].nombre,
                    cuil: dataEmpleado[0].cuil,
                    documento: dataEmpleado[0].documento,
                    tipo: dataEmpleado[0].habilitacion_tipo,
                    sector: dataEmpleado[0].sector
                });
            }
        }
        const parsed = marcacionesWithData.map((marcacion)=>{
            return {
                ...marcacion,
                id: marcacion.evento_id,
                fecha: dayjs(marcacion.fecha).format("DD-MM-YYYY HH:mm:ss")
            }
        })
        res.json(parsed);
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al buscar las marcaciones"});
    }
}
const getMarcacionesById = async (req,res) => {
    try{
        const marcaciones = await knex.select("*").from("sgp.vw_eventos").where({empleado_id: req.params.id});
        let parsed = {};
        marcaciones.forEach(marcacion=>{
            const fechaMarcacion = dayjs(marcacion.fecha).format("YYYY-MM-DD");
            if(!parsed[fechaMarcacion]){
                parsed[fechaMarcacion] = {
                    title: "Marcaciones disponibles",
                    date: fechaMarcacion
                }
            }
        })
        const arrayParsed = Object.values(parsed);
        res.json(arrayParsed);
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: "Hubo un error al buscar las marcaciones"});
    }
}
const getMarcacionesDia = async (req,res) => {
    const {empleado_id, dia} = req.params;
    const parsedDia = dayjs(dia).format("YYYY-MM-DD");
    try{
        const marcaciones = await knex.select("*").from("sgp.vw_eventos").where({empleado_id}).andWhereBetween("fecha",[`${parsedDia} 00:00:00`,`${parsedDia} 23:59:59`]);
        const parsedMarcaciones = marcaciones.map((marcacion)=>{
            
            return {
                id: marcacion.evento_id,
                hora: dayjs(marcacion.fecha).format("HH:mm:ss"),
                dispositivo: marcacion.equipo,
            }
        })
        res.json(parsedMarcaciones);
    }catch(e){
        console.log(e.message);
        res.json([]);
    }
}
const marcacionesController = {
    getMarcaciones,
    getMarcacionesById,
    getMarcacionesDia
}

module.exports = {marcacionesController};