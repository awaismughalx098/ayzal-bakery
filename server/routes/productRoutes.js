const express =
require("express");

const router =
express.Router();

const multer =
require("multer");

const path =
require("path");

const fs =
require("fs");

const mongoose =
require("mongoose");

const Product =
require("../models/Product");

const {
  protect
} = require("../middleware/authMiddleware");

/* ===================================== */
/* UPLOAD FOLDER */
/* ===================================== */

const uploadDir =
path.join(
  __dirname,
  "..",
  "uploads"
);

if(!fs.existsSync(uploadDir)){

  fs.mkdirSync(
    uploadDir,
    { recursive:true }
  );

}

/* ===================================== */
/* STORAGE + FILE VALIDATION */
/* ===================================== */

const ALLOWED_EXT =
[".jpg",".jpeg",".png",".webp",".gif"];

const ALLOWED_MIME =
[
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

const storage =
multer.diskStorage({

  destination:(req,file,cb)=>{

    cb(null, uploadDir);

  },

  filename:(req,file,cb)=>{

    /* The original filename cannot be trusted, so we
       generate our own and stop anything like
       "../../x.js" from doing path traversal. */

    const ext =
    path.extname(file.originalname)
      .toLowerCase();

    const safeExt =
    ALLOWED_EXT.includes(ext)
      ? ext
      : ".jpg";

    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`
    );

  }

});

const upload =
multer({

  storage,

  limits:{
    fileSize: 5 * 1024 * 1024,  /* 5 MB */
    files: 1
  },

  fileFilter:(req,file,cb)=>{

    const ext =
    path.extname(file.originalname)
      .toLowerCase();

    if(
      ALLOWED_EXT.includes(ext) &&
      ALLOWED_MIME.includes(file.mimetype)
    ){

      return cb(null, true);

    }

    cb(
      new Error(
        "Only image files are allowed (jpg, png, webp, gif)."
      )
    );

  }

});

/* Turn multer's own errors into a readable message */

const uploadImage = (req,res,next) => {

  upload.single("image")(req,res,(error)=>{

    if(!error)
      return next();

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The image must be smaller than 5MB."
        : error.message || "Image upload failed.";

    res.status(400).json({
      success:false,
      message
    });

  });

};

/* ===================================== */
/* HELPERS */
/* ===================================== */

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const badId = (res) =>
  res.status(400).json({
    success:false,
    message:"Invalid product id."
  });

/* Validate the body — the client is not trusted */

const validateProduct = (body, { partial = false } = {}) => {

  const errors = [];

  const title =
  String(body.title || "").trim();

  /* Optional field */
  const description =
  String(body.description || "").trim();

  const category =
  String(body.category || "").trim().toLowerCase();

  const price =
  Number(body.price);

  if(!partial || body.title !== undefined){
    if(title.length < 2 || title.length > 80)
      errors.push("Title must be between 2 and 80 characters.");
  }

  if(!partial || body.price !== undefined){
    if(!Number.isFinite(price) || price < 0 || price > 1000000)
      errors.push("Price must be a valid number.");
  }

  if(!partial || body.category !== undefined){
    if(category.length < 2 || category.length > 40)
      errors.push("Please choose a valid category.");
  }

  if(description.length > 500){
    errors.push("Description must be under 500 characters.");
  }

  return {
    errors,
    value:{ title, price, description, category }
  };

};

/* ===================================== */
/* GET ALL PRODUCTS  — PUBLIC */
/* ===================================== */

router.get("/", async(req,res)=>{

  try{

    const products =
    await Product.find().sort({ createdAt:-1 });

    res.json(products);

  }

  catch(error){

    console.error("[products:list]", error.message);

    res.status(500).json({
      success:false,
      message:"Could not load products."
    });

  }

});

/* ===================================== */
/* ADD PRODUCT  — ADMIN ONLY */
/* ===================================== */

router.post(

  "/add",

  protect,

  uploadImage,

  async(req,res)=>{

    try{

      const { errors, value } =
      validateProduct(req.body);

      if(errors.length){

        return res.status(400).json({
          success:false,
          message:errors[0]
        });

      }

      const product =
      new Product({

        ...value,

        image: req.file
          ? `/uploads/${req.file.filename}`
          : ""

      });

      await product.save();

      res.status(201).json({
        success:true,
        product
      });

    }

    catch(error){

      console.error("[products:add]", error.message);

      res.status(500).json({
        success:false,
        message:"Could not save the product."
      });

    }

  }

);

/* ===================================== */
/* UPDATE PRODUCT  — ADMIN ONLY */
/* ===================================== */

router.put(

  "/:id",

  protect,

  uploadImage,

  async(req,res)=>{

    try{

      if(!isValidId(req.params.id))
        return badId(res);

      const product =
      await Product.findById(req.params.id);

      if(!product){

        return res.status(404).json({
          success:false,
          message:"Product not found."
        });

      }

      const { errors, value } =
      validateProduct(req.body, { partial:true });

      if(errors.length){

        return res.status(400).json({
          success:false,
          message:errors[0]
        });

      }

      if(value.title)    product.title = value.title;
      if(value.category) product.category = value.category;

      /* Description is optional, so an empty string is a
         legitimate "clear it" — only skip when the field
         was not sent at all. */
      if(req.body.description !== undefined)
        product.description = value.description;

      if(Number.isFinite(value.price))
        product.price = value.price;

      /* NEW IMAGE — remove the previous file */

      if(req.file){

        const old = product.image;

        product.image =
        `/uploads/${req.file.filename}`;

        if(old && old.startsWith("/uploads/")){

          fs.promises
            .unlink(path.join(uploadDir, path.basename(old)))
            .catch(()=>{ /* file was already gone */ });

        }

      }

      await product.save();

      res.json({
        success:true,
        product
      });

    }

    catch(error){

      console.error("[products:update]", error.message);

      res.status(500).json({
        success:false,
        message:"Could not update the product."
      });

    }

  }

);

/* ===================================== */
/* DELETE PRODUCT  — ADMIN ONLY */
/* ===================================== */

router.delete(

  "/:id",

  protect,

  async(req,res)=>{

    try{

      if(!isValidId(req.params.id))
        return badId(res);

      const product =
      await Product.findByIdAndDelete(req.params.id);

      if(!product){

        return res.status(404).json({
          success:false,
          message:"Product not found."
        });

      }

      /* Remove the uploaded image too */

      if(
        product.image &&
        product.image.startsWith("/uploads/")
      ){

        fs.promises
          .unlink(
            path.join(uploadDir, path.basename(product.image))
          )
          .catch(()=>{});

      }

      res.json({
        success:true,
        message:"Product deleted."
      });

    }

    catch(error){

      console.error("[products:delete]", error.message);

      res.status(500).json({
        success:false,
        message:"Could not delete the product."
      });

    }

  }

);

module.exports =
router;
