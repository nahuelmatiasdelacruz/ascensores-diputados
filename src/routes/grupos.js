const {Router} = require('express');
const { gruposController } = require('../controllers/grupos');
const router = Router();

router.get('/asociados/:id',gruposController.getGruposAsociados);
router.get('/',gruposController.getGrupos);
router.get('/:id',gruposController.getGrupoById);
router.post('/',gruposController.addGroup);
router.post('/asociar',gruposController.asociarGrupo);
router.delete('/asociados/delete/:id',gruposController.borrarGrupoAsociado);
router.put('/',gruposController.updateGroup);
router.delete('/:id',gruposController.deleteGroup);

// Equipos agrupados
router.post('/grupo_equipos',gruposController.addGrupoEquipo);
router.delete('/grupo_equipos/:id',gruposController.deleteGrupoEquipo);

module.exports = router;