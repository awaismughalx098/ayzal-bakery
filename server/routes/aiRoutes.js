const express =
require("express");

const router =
express.Router();

const OpenAI =
require("openai").default;

/* OPENAI */

const openai =
new OpenAI({

  apiKey:
  process.env.OPENAI_API_KEY

});

/* TEST */

console.log(

  "OPENAI KEY:",

  process.env.OPENAI_API_KEY

);

/* GENERATE IMAGE */

router.post(

  "/generate-image",

  async(req,res)=>{

    try{

      const { prompt } =
      req.body;

      if(!prompt){

        return res.status(400).json({

          success:false,

          message:
          "Prompt is required"

        });

      }

      const response =

      await openai.images.generate({

        model:"gpt-image-1",

        prompt:

        `Luxury premium bakery item, realistic food photography, ${prompt}`,

        size:"1024x1024"

      });

      const imageUrl =

      response.data[0].url;

      res.json({

        success:true,

        image:imageUrl

      });

    }

    catch(error){

      console.log(error);

      res.status(500).json({

        success:false,

        message:
        "AI image generation failed"

      });

    }

  }

);

module.exports =
router;