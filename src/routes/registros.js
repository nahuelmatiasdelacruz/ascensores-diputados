const {Router} = require("express");
const { registrosController } = require("../controllers/registros");
const router = Router();

router.get("/all",registrosController.getAllRegistros);
router.get("/filtro",registrosController.getRegistros);

module.exports = router;