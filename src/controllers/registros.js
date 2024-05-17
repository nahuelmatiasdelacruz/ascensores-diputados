const { knex } = require('../helpers/knexConfig');
const Registro = {
    getRegistros: function (filtro) {
      return knex('sgp.vw_marcaciones').where(filtro);
    },
  };

const getAllRegistros = async (req,res) => {
    try{
        const data = await knex.select('*').from('sgp.vw_marcaciones').where('registro_activo',true);
        res.json(data);
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: 'Error al buscar los registros'});
    }
}

const getRegistros = async (req,res) => {
    const {fechaDesde, fechaHasta, nombre, apellido, dni, cuil, tipo, sector} = req.query;
    const filtro = {};
    if(fechaDesde && fechaHasta){
        filtro.fecha = (builder) => {
            builder.whereBetween('fecha',[fechaDesde, fechaHasta]);
        }
    }else if(fechaDesde){
        filtro.fecha = (builder) => {
            builder.where('fecha','>=',fechaDesde);
        };
    }else if(fechaHasta){
        filtro.fecha = (builder) => {
            builder.where('fecha','<=',fechaHasta);
        };
    }
    if(nombre){
        filtro.nombre = nombre;
    }
    if(dni){
        filtro.dni = dni;
    }
    if(apellido){
        filtro.apellido = apellido;
    }
    if(cuil){
        filtro.cuil = cuil;
    }
    if(tipo){
        filtro.tipo = tipo;
    }
    if(sector){
        filtro.sector = sector;
    }
    try{
        const registros = await Registro.getRegistros(filtro);
        res.json(registros);
    }catch(e){
        console.log(e.message);
        res.status(500).json({msg: 'Hubo un error al filtrar los datos'});
    }
}

const registrosController = {
    getRegistros,
    getAllRegistros
}

module.exports = {registrosController};