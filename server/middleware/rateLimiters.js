const rateLimit =
require("express-rate-limit");

const message = (text) => ({
  success:false,
  message:text
});

/* ============================================
   LOGIN — a strict limit to stop brute forcing
   ============================================ */

const loginLimiter =
rateLimit({

  windowMs: 15 * 60 * 1000,   /* 15 minutes */
  max: 10,                    /* 10 attempts per IP */

  standardHeaders:true,
  legacyHeaders:false,

  /* Successful logins should not count */
  skipSuccessfulRequests:true,

  message: message(
    "Too many login attempts. Please try again in 15 minutes."
  )

});

/* ============================================
   ORDERS — keeps spam orders out
   ============================================ */

const orderLimiter =
rateLimit({

  windowMs: 10 * 60 * 1000,   /* 10 minutes */
  max: 20,

  standardHeaders:true,
  legacyHeaders:false,

  message: message(
    "Too many orders. Please wait a moment or call us instead."
  )

});

/* ============================================
   GENERAL API — a light limit across the board
   ============================================ */

const apiLimiter =
rateLimit({

  windowMs: 60 * 1000,        /* 1 minute */
  max: 200,

  standardHeaders:true,
  legacyHeaders:false,

  message: message(
    "Too many requests. Please slow down."
  )

});

module.exports = {
  loginLimiter,
  orderLimiter,
  apiLimiter
};
