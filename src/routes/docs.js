const {Router} = require("express");
const {docsController} = require("../controllers/docs");
const multer = require("multer");
const path = require("path");
const router = Router();
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        const dest = path.join(__dirname,"..","..","uploads");
        cb(null,dest);
    },
    filename: function(req,file,cb){
        const uniquename = Date.now() + "" + Math.round(Math.random() * 1E9);
        const fileExt = file.originalname.split('.').pop();
        const fileNameNew = uniquename + "." + fileExt;
        file.originalname = fileNameNew;
        cb(null,fileNameNew);
    }

});
const upload = multer({storage});

router.get("/download/:id",docsController.getDocById);
router.get("/:id",docsController.getDocumentaciones);
router.post("/",upload.single("pdfFile"),docsController.subirDocumentacion);
router.delete("/:id",docsController.deleteDoc);

module.exports = router;