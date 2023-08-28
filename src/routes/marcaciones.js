const {Router} = require("express");
const { marcacionesController } = require("../controllers/marcaciones");

const router = Router();

router.get("/",marcacionesController.getMarcaciones);
router.get("/:id",marcacionesController.getMarcacionesById);
router.get("/dia/:empleado_id/:dia", marcacionesController.getMarcacionesDia);

module.exports = router;