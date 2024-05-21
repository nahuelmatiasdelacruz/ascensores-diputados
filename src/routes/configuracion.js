const {Router} = require('express');
const {configurationController} = require('../controllers/configurationController');
const router = Router();

router.get('/periodos',configurationController.getPeriodos);
router.post('/periodos',configurationController.addPeriodo);
router.put('/periodos',configurationController.updatePeriodo);
router.delete('/periodos',configurationController.deletePeriodo);

module.exports = router;