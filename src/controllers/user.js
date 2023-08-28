const bcryptjs = require("bcryptjs");

const usuariosGet = async (req, res) => {
	
};
const getUserById = async (req, res) => {
	
};
const usuariosPut = async (req, res) => {
	const id = req.params.id;
	const { _id, password, correo, ...resto } = req.body;

	if (password) {
		const salt = bcryptjs.genSaltSync();
		resto.password = bcryptjs.hashSync(password, salt);
	}
	const usuario = "" // TODO: Agregar endpoint para DB;
	res.json(usuario);
};
const usuariosPost = async (req, res) => {
	const { nombre, correo, password, rol } = req.body;
	// TODO: Endpoint para DB
	res.json({
		msg: "Post api - Controlador",
		usuario,
	});
};
const usuariosDelete = async (req, res) => {
	const {id} = req.params;
	// TODO: Endpoint
	res.json({});
};
const usersController = {
	getUserById,
	usuariosGet,
	usuariosDelete,
	usuariosPost,
	usuariosPut,
}
module.exports = {usersController};
