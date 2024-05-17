const {Router} = require('express');
const { visitasController } = require('../controllers/visitas');
const router = Router();

router.get('/',visitasController.getVisitas);
router.get('/:id',visitasController.getVisitaById);
router.post('/',visitasController.addVisita);
router.put('/',visitasController.updateVisita);
router.delete('/:id',visitasController.deleteVisita);

module.exports = router;