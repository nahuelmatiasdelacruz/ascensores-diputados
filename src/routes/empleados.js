const { Router } = require('express');
const { empleadosController } = require('../controllers/empleados');
const router = Router();

router.post('/changePhoto',empleadosController.changePhoto);
router.get('/facial/:id',empleadosController.getPhotoById);
router.get('/sectores',empleadosController.getSectores);
router.get('/tipos',empleadosController.getTipos);
router.get('/:id',empleadosController.getEmpleadoById);
router.get('/',empleadosController.getEmpleados);
router.get('/filtrados/:estado',empleadosController.getEmpleadosFiltro);
router.post('/',empleadosController.addEmpleado);
router.put('/',empleadosController.updateEmpleado);
router.delete('/:id',empleadosController.deleteEmpleado);

module.exports = router;
