const express =
require("express");

const cors =
require("cors");

const helmet =
require("helmet");

const dotenv =
require("dotenv");

const path =
require("path");

/* LOAD ENV */

dotenv.config({
  path:"./.env"
});

/* ===================================== */
/* STARTUP CHECKS                          */
/* Running without a secret is dangerous.   */
/* Failing loudly beats starting silently   */
/* in an insecure state.                    */
/* ===================================== */

const REQUIRED_ENV = ["MONGO_URI","JWT_SECRET"];

const missing =
REQUIRED_ENV.filter(key => !process.env[key]);

if(missing.length){

  console.error(
    `\n[FATAL] Missing env variable(s): ${missing.join(", ")}\n` +
    `Add it to server/.env and start again.\n`
  );

  process.exit(1);

}

if(process.env.JWT_SECRET.length < 32){

  console.error(
    "\n[FATAL] JWT_SECRET is too short. Use a strong random secret of at least 32 characters.\n"
  );

  process.exit(1);

}

/* DB */

const connectDB =
require("./config/db");

connectDB();

/* MIDDLEWARE */

const sanitize =
require("./middleware/sanitize");

const {
  apiLimiter
} = require("./middleware/rateLimiters");

/* APP */

const app =
express();

const isProd =
process.env.NODE_ENV === "production";

/* Behind the Render/Vercel proxy, get the real client
   IP so rate limiting actually works */

app.set("trust proxy", 1);

/* Drop Express's "X-Powered-By" header */

app.disable("x-powered-by");

/* ===================================== */
/* FORCE HTTPS IN PRODUCTION */
/* ===================================== */

if(isProd){

  app.use((req,res,next)=>{

    /* Render terminates TLS, so the original scheme
       arrives in x-forwarded-proto */

    if(req.headers["x-forwarded-proto"] === "http"){

      return res.redirect(
        301,
        `https://${req.headers.host}${req.originalUrl}`
      );

    }

    next();

  });

}

/* ===================================== */
/* SECURITY HEADERS */
/* ===================================== */

app.use(
  helmet({

    /* This is a JSON API — nothing here should ever
       run as a page, so lock the policy right down. */

    contentSecurityPolicy:{
      useDefaults:false,
      directives:{
        "default-src":["'none'"],
        "img-src":["'self'"],
        "frame-ancestors":["'none'"],
        "base-uri":["'none'"],
        "form-action":["'none'"]
      }
    },

    /* Uploaded images are served to the Vercel frontend,
       which is a different origin */

    crossOriginResourcePolicy:{
      policy:"cross-origin"
    },

    crossOriginEmbedderPolicy:false,

    /* Tell browsers to only ever use HTTPS */

    hsts:{
      maxAge:63072000,
      includeSubDomains:true,
      preload:true
    },

    referrerPolicy:{
      policy:"no-referrer"
    },

    frameguard:{
      action:"deny"
    }

  })
);

/* Extra headers helmet does not set by default */

app.use((req,res,next)=>{

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );

  /* Admin responses must never sit in a shared cache */

  if(req.path.startsWith("/api/admin") ||
     req.path.startsWith("/api/orders")){

    res.setHeader("Cache-Control", "no-store");
  }

  next();

});

/* ===================================== */
/* CORS — allow only our own frontends */
/* ===================================== */

const allowedOrigins =
(process.env.CLIENT_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(
  cors({

    origin:(origin, callback)=>{

      /* Postman, server-to-server and same-origin
         requests carry no origin */

      if(!origin)
        return callback(null, true);

      /* An empty list allows everything in dev, but
         nothing outside the list in production */

      if(allowedOrigins.length === 0){

        if(!isProd)
          return callback(null, true);

        return callback(
          new Error("CORS: no allowed origins configured")
        );

      }

      if(allowedOrigins.includes(origin))
        return callback(null, true);

      callback(
        new Error(`CORS: origin ${origin} is not allowed`)
      );

    },

    credentials:true

  })
);

/* ===================================== */
/* BODY PARSING — with a size limit */
/* ===================================== */

app.use(
  express.json({
    limit:"100kb"
  })
);

app.use(
  express.urlencoded({
    extended:true,
    limit:"100kb"
  })
);

/* NoSQL injection guard */

app.use(sanitize);

/* General rate limit */

app.use("/api", apiLimiter);

/* ===================================== */
/* STATIC UPLOADS */
/* ===================================== */

app.use(

  "/uploads",

  express.static(
    path.join(__dirname, "uploads"),
    {
      /* Never let an uploaded file execute */
      setHeaders:(res)=>{
        res.setHeader(
          "Content-Disposition",
          "inline"
        );
        res.setHeader(
          "X-Content-Type-Options",
          "nosniff"
        );
      }
    }
  )

);

/* ===================================== */
/* ROUTES */
/* ===================================== */

app.use(
  "/api/orders",
  require("./routes/orderRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

app.use(
  "/api/products",
  require("./routes/productRoutes")
);

/* HEALTH CHECK */

app.get("/", (req,res)=>{

  res.json({
    success:true,
    message:"Munch Box API running"
  });

});

/* 404 */

app.use((req,res)=>{

  res.status(404).json({
    success:false,
    message:"Route not found"
  });

});

/* ===================================== */
/* ERROR HANDLER */
/* Internal details must never leak in production */
/* ===================================== */

app.use((err,req,res,next)=>{

  console.error("[error]", err.message);

  if(err.message && err.message.startsWith("CORS:")){

    return res.status(403).json({
      success:false,
      message:"Not allowed."
    });

  }

  res.status(err.status || 500).json({

    success:false,

    message: isProd
      ? "Server error"
      : err.message

  });

});

/* PORT */

const PORT =
process.env.PORT || 5000;

/* START SERVER */

app.listen(PORT, ()=>{

  console.log(
    `Munch Box API running on ${PORT} (${isProd ? "production" : "development"})`
  );

});
