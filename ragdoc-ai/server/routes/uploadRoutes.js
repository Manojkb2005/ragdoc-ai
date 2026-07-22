const express=require("express");
const multer=require("multer");

const protect=require("../middleware/authMiddleware");

const {uploadPDF}=require("../controllers/uploadController");

const router=express.Router();

const storage=multer.diskStorage({

destination:function(req,file,cb){

cb(null,"uploads/");

},

filename:function(req,file,cb){

cb(null,Date.now()+"-"+file.originalname);

}

});

const upload=multer({

storage,

fileFilter:function(req,file,cb){

if(file.mimetype==="application/pdf"){

cb(null,true);

}

else{

cb(new Error("Only PDF files allowed"));

}

}

});

router.post(

"/",

protect,

upload.single("pdf"),

uploadPDF

);

module.exports=router;