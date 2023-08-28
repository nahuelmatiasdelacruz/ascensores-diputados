const {Router} = require("express");
const {habilitacionesController} = require("../controllers/habilitaciones");
const router = Router();

router.get("/:id",habilitacionesController.getHabilitaciones);
router.post("/",habilitacionesController.addHabilitacion);
router.put("/",habilitacionesController.updateHabilitacion);
router.delete("/inhabilitar/:id",habilitacionesController.inhabilitarEmpleado);
router.delete("/:id",habilitacionesController.deleteHabilitacion);

module.exports = router;