const mongoose =
require("mongoose");

const bcrypt =
require("bcryptjs");

const adminSchema =
new mongoose.Schema({

  name:{
    type:String,
    trim:true,
    default:"Munch Box Admin"
  },

  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },

  password:{
    type:String,
    required:true,
    minlength:8,

    /* Never return the password from a default query */
    select:false
  },

  /* Brute force protection */

  loginAttempts:{
    type:Number,
    default:0,
    select:false
  },

  lockedUntil:{
    type:Date,
    select:false
  }

},{
  timestamps:true
});

/* ============================================
   ONE ADMIN ONLY
   --------------------------------------------
   Even if someone writes the code or adds a route
   by mistake, a second admin can never reach the
   database.
   ============================================ */

/* NOTE: in Mongoose 9 an async hook receives no
   "next" — you simply return or throw. */

adminSchema.pre("save", async function(){

  if(!this.isNew)
    return;

  const count =
  await this.constructor.countDocuments();

  if(count > 0){

    throw new Error(
      "Only one admin account is allowed."
    );

  }

});

/* PASSWORD HASH — before save */

adminSchema.pre("save", async function(){

  if(!this.isModified("password"))
    return;

  const salt =
  await bcrypt.genSalt(12);

  this.password =
  await bcrypt.hash(this.password, salt);

});

/* PASSWORD CHECK */

adminSchema.methods.matchPassword =
async function(entered){

  return bcrypt.compare(
    entered,
    this.password
  );

};

/* ACCOUNT LOCKED? */

adminSchema.methods.isLocked =
function(){

  return Boolean(
    this.lockedUntil &&
    this.lockedUntil > Date.now()
  );

};

module.exports =
mongoose.model(
  "Admin",
  adminSchema
);
