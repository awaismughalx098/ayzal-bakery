/* ============================================
   CREATE OR RESET THE ADMIN ACCOUNT
   --------------------------------------------
   Run this from inside the server folder:

     npm run create-admin -- admin@munchbox.com "MyStrongPassword123"

   Leave the password out and the script generates a
   strong random one and prints it once.

   Passing the same email again resets the password.
   This app allows exactly one admin account.
   ============================================ */

const path = require("path");
const crypto = require("crypto");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const run = async () => {
  const email = String(process.argv[2] || "")
    .toLowerCase()
    .trim();

  let password = process.argv[3];
  let generated = false;

  if (!email || !email.includes("@")) {
    console.error(
      '\nUsage: npm run create-admin -- <email> ["password"]\n' +
        'Example: npm run create-admin -- admin@munchbox.com "MyStrongPass123"\n'
    );
    process.exit(1);
  }

  if (!password) {
    /* An 18 character random password */
    password = crypto.randomBytes(14).toString("base64url").slice(0, 18);
    generated = true;
  }

  if (password.length < 8) {
    console.error("\nThe password must be at least 8 characters.\n");
    process.exit(1);
  }

  if (!process.env.MONGO_URI) {
    console.error("\nMONGO_URI was not found in server/.env.\n");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email }).select("+password");

  if (existing) {
    existing.password = password;
    /* The pre-save hook does the hashing */
    await existing.save();

    console.log(`\nPassword reset for existing admin: ${email}`);
  } else {
    /* ---- ONLY ONE ADMIN ALLOWED ---- */

    const count = await Admin.countDocuments();

    if (count > 0) {
      const current = await Admin.findOne().select("email");

      console.error(
        `\nAn admin already exists: ${current.email}\n\n` +
          `  This app allows only one admin account.\n` +
          `  To reset the password, pass the same email again:\n\n` +
          `    npm run create-admin -- ${current.email} "NewPassword123"\n\n` +
          `  To use a different email, delete the old account from the database first.\n`
      );

      await mongoose.disconnect();
      process.exit(1);
    }

    await Admin.create({
      email,
      password,
      name: "Munch Box Admin",
    });

    console.log(`\nAdmin created: ${email}`);
  }

  if (generated) {
    console.log(`\n  Password: ${password}`);
    console.log(
      "\n  This password is shown only once. Save it now, because"
    );
    console.log("  the database stores only a hash of it.");
  }

  console.log("\n  Sign in at: /adminlogin\n");

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((error) => {
  console.error("\nCould not create the admin:", error.message, "\n");
  process.exit(1);
});
