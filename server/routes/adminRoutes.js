const express =
require("express");

const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

const router =
express.Router();

const Admin =
require("../models/Admin");

/* LOGIN */

router.post(
  "/login",

  async(req,res)=>{

    const { email,password } =
    req.body;

    const admin =
    await Admin.findOne({
      email
    });

    if(!admin){

      return res.status(400).json({
        message:"Admin Not Found"
      });

    }

    const isMatch =
    await bcrypt.compare(

      password,

      admin.password

    );

    if(!isMatch){

      return res.status(400).json({
        message:"Wrong Password"
      });

    }

    const token =
    jwt.sign(

      {
        id:admin._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"7d"
      }

    );

    res.json({

      token,

      admin

    });

  }

);

module.exports =
router;