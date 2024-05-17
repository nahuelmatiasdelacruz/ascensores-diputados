
const enrolarFacial = async (req,res) => {
    const {idEquipo,empleado_id} = req.body;
    const result = await axios.post('http://localhost:9099',{
      id: `${idEquipo}`,
      esBase: true,
      id_usuario: empleado_id
    },{headers:{'x-action':'AgregarUsuario'}});
}
const enrolarHuella = async (req,res) => {
  res.status(200).json({msg: 'ok'});
}
const enrolacionesController = {
    enrolarFacial,
    enrolarHuella
}

module.exports = {enrolacionesController}