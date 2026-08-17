const jwt =
require("jsonwebtoken");

const Admin =
require("../models/Admin");

/* ============================================
   PROTECT
   --------------------------------------------
   Only an admin with a valid JWT gets through.
   The token arrives as "Authorization: Bearer <token>".
   ============================================ */

const protect =
async(req,res,next)=>{

  try{

    const header =
    req.headers.authorization || "";

    if(!header.startsWith("Bearer ")){

      return res.status(401).json({
        success:false,
        message:"Not authorized. Please login."
      });

    }

    const token =
    header.split(" ")[1];

    if(!token){

      return res.status(401).json({
        success:false,
        message:"Not authorized. Please login."
      });

    }

    /* VERIFY SIGNATURE + EXPIRY */

    let decoded;

    try{

      decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    }

    catch(error){

      /* Expired, tampered with, or signed with a bad secret */

      return res.status(401).json({
        success:false,
        message:
          error.name === "TokenExpiredError"
            ? "Session expired. Please login again."
            : "Invalid session. Please login again."
      });

    }

    /* Does the admin still exist? */

    const admin =
    await Admin.findById(decoded.id);

    if(!admin){

      return res.status(401).json({
        success:false,
        message:"Account no longer exists."
      });

    }

    /* Invalidate old tokens once the password changes */

    if(
      decoded.iat &&
      admin.updatedAt &&
      decoded.iat * 1000 < admin.updatedAt.getTime() - 1000
    ){

      return res.status(401).json({
        success:false,
        message:"Credentials changed. Please login again."
      });

    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name
    };

    next();

  }

  catch(error){

    console.error("[auth]", error.message);

    res.status(401).json({
      success:false,
      message:"Not authorized."
    });

  }

};

module.exports = { protect };
