const express =
require("express");

const cors =
require("cors");

const dotenv =
require("dotenv");

const path =
require("path");

/* LOAD ENV */

dotenv.config({

  path:"./.env"

});

/* DB */

const connectDB =
require("./config/db");

connectDB();

/* APP */

const app =
express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended:true
  })
);

/* STATIC UPLOADS */

app.use(

  "/uploads",

  express.static(

    path.join(
      __dirname,
      "uploads"
    )

  )

);

/* ROUTES */

/* ORDERS */

app.use(

  "/api/orders",

  require(
    "./routes/orderRoutes"
  )

);

/* ADMIN */

app.use(

  "/api/admin",

  require(
    "./routes/adminRoutes"
  )

);

/* PRODUCTS */

app.use(

  "/api/products",

  require(
    "./routes/productRoutes"
  )

);

/* AI IMAGE GENERATION */

app.use(

  "/api/ai",

  require(
    "./routes/aiRoutes"
  )

);

/* TEST ROUTE */

app.get("/", (req,res)=>{

  res.send(
    "API Running Successfully"
  );

});

/* ERROR HANDLER */

app.use(

  (err,req,res,next)=>{

    console.log(err);

    res.status(500).json({

      success:false,

      message:"Server Error"

    });

  }

);

/* PORT */

const PORT =
process.env.PORT || 5000;

/* START SERVER */

app.listen(PORT, ()=>{

  console.log(

    `Server running on ${PORT}`

  );

});