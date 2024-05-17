const {Router} = require('express');
const { usersController } = require('../controllers/user');
const router = Router();

router.get('/',usersController.usuariosGet);
router.get('/:id',usersController.getUserById);
router.post('/',usersController.usuariosPost);
router.put('/',usersController.usuariosPut);
router.delete('/',usersController.usuariosDelete);

module.exports = router;