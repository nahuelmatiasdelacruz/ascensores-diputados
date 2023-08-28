const {Schema,model} = require("mongoose");

const UserSchema = Schema({
    nombre: {type: String, required: [true,"El nombre de usuario es requerido"]},
    password: {type: String, required: [true,"La contraseña del usuario es obligatoria"]},
    img: {type: String, default: "none"},
    role: {type: String, required: [true, "El rol es obligatorio"],enum: ["ADMIN_ROLE","USER_ROLE"]},
    estado: {type: Boolean, default: true}
})

module.exports = model("User",UserSchema);