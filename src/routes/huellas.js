const {Router} = require("express");
const { huellasController } = require("../controllers/huellas");
const router = Router();

router.get("/:id",huellasController.getHuellas);
router.get("/sync/:id",huellasController.syncHuellas);
router.post("/syncall/",huellasController.massiveSync);
router.get("/huella/:id",huellasController.getHuellaById);
router.post("/",huellasController.addHuella);
router.put("/",huellasController.updateHuella);
router.delete("/:huella_id",huellasController.deleteHuella);

module.exports = router;