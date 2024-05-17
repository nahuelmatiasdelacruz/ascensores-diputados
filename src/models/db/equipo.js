const {Schema,model} = require('mongoose');

const EquipoSchema = Schema({
    descripcion: {type: String, required: [true,'La descripción es requerida']},
    tipo: {type: String, required: [true, 'El tipo de equipo es requerido']},
    ip: {type: String, required: [true, 'La IP del equipo es requerida']},
    puerto: {type: Number, required: [true, 'El puerto del equipo es requerido']}
})

module.exports = model('Equipo',EquipoSchema);