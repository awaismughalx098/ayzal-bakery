const mongoose =
require("mongoose");

const productSchema =
new mongoose.Schema({

  title:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  description:{
    type:String,
    default:""
  },

  category:{
    type:String,
    required:true
  },

  image:{
    type:String
  },

  /* Cloudinary public_id, so the old file can be
     removed when the image is replaced or deleted.
     Empty for images kept on local disk. */
  imageId:{
    type:String,
    default:""
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "Product",
  productSchema
);