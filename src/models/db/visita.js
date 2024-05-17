const {Schema,model} = require('mongoose');

const VisitaSchema = Schema({
    ingreso: {type: Date, default: Date.now},
    apellidoynombre: {type: String, required: [true,'Se requiere el nombre y apellido el empleado']},
    documento: {type: Number, required: [true,'Se requiere el documento del empleado']},
    sexo: {type: String, required: [true, 'Se requiere el sexo del empleado'],enum: ['X','M','F']},
    tipoVisita: {type: String, default: 'Trabajo',enum: ['Visita','Trabajo']},
    tipoCarga: {type: String, required: [true, 'Se requiere el tipo de carga']},
    tipoDestino: {type: String, default: 'Sin especificar'},
    destino: {type: String, required: [true,'Se requiere el destino del ingreso']},
    autorizante: {
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }
})

module.exports = model('Visita',VisitaSchema);