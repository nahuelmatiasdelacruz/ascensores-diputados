const { executeServiceFunction } = require("../helpers/externalServiceHelpers");

const enrolarFacial = async (req,res) => {
    const {idEquipo,empleado_id} = req.body;
    const obj = {
      id: `${idEquipo}`,
      esBase: true,
      id_usuario: empleado_id
    };
    await executeServiceFunction(obj,'AgregarUsuario');
}
const enrolarHuella = async (req,res) => {
  res.status(200).json({msg: 'ok'});
}
const enrolacionesController = {
    enrolarFacial,
    enrolarHuella
}

module.exports = {enrolacionesController}