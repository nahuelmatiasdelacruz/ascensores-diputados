const {Router} = require('express');
const { enrolacionesController } = require('../controllers/enrolaciones');

const router = Router();

router.post('/facial',enrolacionesController.enrolarFacial);
router.post('/huella',enrolacionesController.enrolarHuella);

module.exports = router;