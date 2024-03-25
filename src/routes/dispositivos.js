const {Router} = require("express");
const { dispositivosController } = require("../controllers/dispositivos");
const router = Router();

router.get("/asociados/:id",dispositivosController.getEquiposAsociados);
router.get("/estado",dispositivosController.getEstadoDispositivo);
router.get("/tipos_equipos",dispositivosController.getTiposEquipos);
router.get("/tarjetas/:id",dispositivosController.getTarjetas);
router.get("/",dispositivosController.getDispositivos);
router.post("/asociar",dispositivosController.asociarEquipo);
router.post("/tarjetas",dispositivosController.addTarjeta);
router.post("/",dispositivosController.addDispositivo);
router.post("/syncDevice",dispositivosController.sincronizarDispositivo);
router.put("/",dispositivosController.updateDispositivo);
router.delete("/:id/",dispositivosController.deleteDispositivo);
router.delete("/asociados/:equipo_asociado_id/:empleado_id/:equipo_id",dispositivosController.borrarEquipoAsociado);

module.exports = router;