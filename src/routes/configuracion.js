const {Router} = require('express');
const {configuracionController} = require('../controllers/configuracionController');
const router = Router();

router.get('/periodos',configuracionController.getPeriodos);
router.post('/periodos',configuracionController.addPeriodo);
router.put('/periodos',configuracionController.updatePeriodo);
router.delete('/periodos',configuracionController.deletePeriodo);

module.exports = router;