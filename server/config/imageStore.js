const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

/* ============================================
   IMAGE STORE
   --------------------------------------------
   Render's disk is wiped on every deploy, so any
   photo saved there disappears. When Cloudinary
   credentials are present we upload there instead:
   the file survives deploys and is served from a
   CDN, already resized and re-encoded.

   Without credentials it falls back to the local
   disk, which is fine for development.

   Either way the image is shrunk and converted to
   WebP first — a phone photo is often 3-5 MB, and
   nobody should download that on mobile data.
   ============================================ */

const MAX_WIDTH = 1000;
const WEBP_QUALITY = 78;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const useCloudinary = Boolean(cloudName && apiKey && apiSecret);

if (useCloudinary) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  console.log("Image store: Cloudinary");
} else {
  console.warn(
    "Image store: local disk. On Render these files are lost on every deploy — " +
      "set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
  );
}

const uploadDir = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------- shrink + re-encode ---------- */

const optimise = async (buffer) =>
  sharp(buffer)
    .rotate() /* honour the phone's EXIF orientation */
    .resize(MAX_WIDTH, MAX_WIDTH, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

/* ---------- save ---------- */

const saveImage = async (buffer) => {
  const optimised = await optimise(buffer);

  if (useCloudinary) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "munchbox/products",
            resource_type: "image",
            format: "webp",
          },
          (error, uploaded) =>
            error ? reject(error) : resolve(uploaded)
        )
        .end(optimised);
    });

    return {
      url: result.secure_url,
      id: result.public_id,
      bytes: optimised.length,
    };
  }

  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;

  await fs.promises.writeFile(path.join(uploadDir, name), optimised);

  return {
    url: `/uploads/${name}`,
    id: null,
    bytes: optimised.length,
  };
};

/* ---------- delete ---------- */

const deleteImage = async (image, publicId) => {
  try {
    if (publicId && useCloudinary) {
      await cloudinary.uploader.destroy(publicId);
      return;
    }

    if (image && image.startsWith("/uploads/")) {
      await fs.promises.unlink(
        path.join(uploadDir, path.basename(image))
      );
    }
  } catch {
    /* already gone — nothing to clean up */
  }
};

module.exports = {
  saveImage,
  deleteImage,
  uploadDir,
  useCloudinary,
  MAX_WIDTH,
};
