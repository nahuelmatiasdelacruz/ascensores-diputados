const {Schema,model} = require('mongoose');

const EmployeeSchema = Schema({
    nombre: {type: String, required: [true,'El nombre del empleado es un campo requerido']},
    cuil: {type: Number, required: [true,'El cuil del empleado es requerido']},
    documento: {type: Number, required: [true, 'El documento del empleado es requerido']},
    estructura: {
        type: Schema.Types.ObjectId,
        ref: 'Estructura'
    },
    credencial: {type: String, required: true, enum: ['Si','No']}
});

module.exports = model('Employee',EmployeeSchema);