const express =
require("express");

const router =
express.Router();

const multer =
require("multer");

const path =
require("path");

const Product =
require("../models/Product");

/* STORAGE */

const storage =
multer.diskStorage({

  destination:(req,file,cb)=>{

    cb(
      null,
      "uploads/"
    );

  },

  filename:(req,file,cb)=>{

    cb(

      null,

      Date.now() +
      path.extname(
        file.originalname
      )

    );

  }

});

const upload =
multer({ storage });

/* ===================================== */
/* ADD PRODUCT */
/* ===================================== */

router.post(

  "/add",

  upload.single("image"),

  async(req,res)=>{

    try{

      const {

        title,
        price,
        description,
        category

      } = req.body;

      let image = "";

      if(req.file){

        image =
        `http://localhost:5000/uploads/${req.file.filename}`;

      }

      const product =
      new Product({

        title,
        price,
        description,
        category,
        image

      });

      await product.save();

      res.json({

        success:true,
        product

      });

    }

    catch(error){

      console.log(error);

      res.status(500).json({

        success:false,
        message:error.message

      });

    }

  }

);

/* ===================================== */
/* GET ALL PRODUCTS */
/* ===================================== */

router.get("/", async(req,res)=>{

  try{

    const products =
    await Product.find();

    res.json(products);

  }

  catch(error){

    res.status(500).json({

      message:error.message

    });

  }

});

/* ===================================== */
/* UPDATE PRODUCT */
/* ===================================== */

router.put(

  "/:id",

  upload.single("image"),

  async(req,res)=>{

    try{

      const product =
      await Product.findById(
        req.params.id
      );

      if(!product){

        return res.status(404).json({

          message:"Product not found"

        });

      }

      product.title =
      req.body.title ||
      product.title;

      product.price =
      Number(req.body.price) ||
      product.price;

      product.description =
      req.body.description ||
      product.description;

      product.category =
      req.body.category ||
      product.category;

      /* NEW IMAGE */

      if(req.file){

        product.image =
        `http://localhost:5000/uploads/${req.file.filename}`;

      }

      await product.save();

      res.json({

        success:true,
        product

      });

    }

    catch(error){

      console.log(error);

      res.status(500).json({

        success:false,
        message:error.message

      });

    }

  }

);

/* ===================================== */
/* DELETE PRODUCT */
/* ===================================== */

router.delete(

  "/:id",

  async(req,res)=>{

    try{

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({

        success:true,
        message:"Product Deleted"

      });

    }

    catch(error){

      res.status(500).json({

        success:false,
        message:error.message

      });

    }

  }

);

module.exports = router;