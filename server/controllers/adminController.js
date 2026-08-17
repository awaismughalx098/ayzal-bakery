const jwt =
require("jsonwebtoken");

const Admin =
require("../models/Admin");

/* How many failed attempts before the account locks */
const MAX_ATTEMPTS = 5;

/* How long the lock lasts */
const LOCK_MINUTES = 15;

/* BUILD A TOKEN */

const signToken = (admin) =>
  jwt.sign(
    { id: admin._id.toString() },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "2h"
    }
  );

/* ============================================
   POST /api/admin/login
   ============================================ */

const login =
async(req,res)=>{

  try{

    const email =
    String(req.body.email || "")
      .toLowerCase()
      .trim();

    const password =
    String(req.body.password || "");

    if(!email || !password){

      return res.status(400).json({
        success:false,
        message:"Email and password are both required."
      });

    }

    /* Explicitly select the password and lock fields */

    const admin =
    await Admin.findOne({ email })
      .select("+password +loginAttempts +lockedUntil");

    /* NOTE: a wrong email and a wrong password return
       deliberately identical messages so nobody can
       enumerate valid accounts. */

    const INVALID = {
      success:false,
      message:"Invalid email or password."
    };

    if(!admin){
      return res.status(401).json(INVALID);
    }

    /* LOCKED? */

    if(admin.isLocked()){

      const mins =
      Math.ceil(
        (admin.lockedUntil - Date.now()) / 60000
      );

      return res.status(429).json({
        success:false,
        message:
          `Too many failed attempts. Try again in ${mins} minute(s).`
      });

    }

    const isMatch =
    await admin.matchPassword(password);

    if(!isMatch){

      admin.loginAttempts =
      (admin.loginAttempts || 0) + 1;

      if(admin.loginAttempts >= MAX_ATTEMPTS){

        admin.lockedUntil =
        new Date(
          Date.now() + LOCK_MINUTES * 60000
        );

        admin.loginAttempts = 0;

      }

      /* validateBeforeSave off, otherwise the password
         would be hashed a second time */
      await admin.save({ validateBeforeSave:false });

      return res.status(401).json(INVALID);

    }

    /* SUCCESS — reset the counters */

    if(admin.loginAttempts || admin.lockedUntil){

      admin.loginAttempts = 0;
      admin.lockedUntil = undefined;

      await admin.save({ validateBeforeSave:false });

    }

    /* Never send the password back */

    res.json({
      success:true,
      token: signToken(admin),
      admin:{
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email
      }
    });

  }

  catch(error){

    console.error("[login]", error.message);

    res.status(500).json({
      success:false,
      message:"Login failed. Please try again."
    });

  }

};

/* ============================================
   GET /api/admin/me   (protected)
   Lets the frontend verify a token on page load
   ============================================ */

const getMe = (req,res) => {

  res.json({
    success:true,
    admin:req.admin
  });

};

/* ============================================
   PUT /api/admin/password   (protected)
   ============================================ */

const changePassword =
async(req,res)=>{

  try{

    const currentPassword =
    String(req.body.currentPassword || "");

    const newPassword =
    String(req.body.newPassword || "");

    if(newPassword.length < 8){

      return res.status(400).json({
        success:false,
        message:"The new password must be at least 8 characters."
      });

    }

    const admin =
    await Admin.findById(req.admin.id)
      .select("+password");

    if(!admin){

      return res.status(404).json({
        success:false,
        message:"Admin not found."
      });

    }

    const isMatch =
    await admin.matchPassword(currentPassword);

    if(!isMatch){

      return res.status(401).json({
        success:false,
        message:"Your current password is incorrect."
      });

    }

    admin.password = newPassword;

    /* The pre-save hook hashes the new password */
    await admin.save();

    res.json({
      success:true,
      message:"Password updated. Please sign in again."
    });

  }

  catch(error){

    console.error("[changePassword]", error.message);

    res.status(500).json({
      success:false,
      message:"Password update failed."
    });

  }

};

module.exports = {
  login,
  getMe,
  changePassword
};
