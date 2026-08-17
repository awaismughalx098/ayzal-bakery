/* ============================================
   CREATE OR RESET THE ADMIN ACCOUNT
   --------------------------------------------
   Run this from inside the server folder:

     npm run create-admin -- admin@munchbox.com "MyStrongPassword123"

   Leave the password out and the script generates a
   strong random one and prints it once.

   Passing the same email again resets the password.

   To change the email as well, add --replace:

     npm run create-admin -- new@email.com "Password123" --replace

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
  const args = process.argv.slice(2);

  /* --replace lets a single existing admin change its
     email, instead of being told to delete it first */
  const replace = args.includes("--replace");

  const positional = args.filter((a) => !a.startsWith("--"));

  const email = String(positional[0] || "")
    .toLowerCase()
    .trim();

  let password = positional[1];
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
      const current = await Admin.findOne().select("+password");

      if (replace) {
        /* Same account, new email and password. Keeping the
           document means the one-admin rule still holds. */
        const oldEmail = current.email;

        current.email = email;
        current.password = password;

        await current.save();

        console.log(`\nAdmin email changed: ${oldEmail} -> ${email}`);
        console.log("Password updated at the same time.");
      } else {
        console.error(
          `\nAn admin already exists: ${current.email}\n\n` +
            `  This app allows only one admin account.\n` +
            `  To reset its password, pass the same email again:\n\n` +
            `    npm run create-admin -- ${current.email} "NewPassword123"\n\n` +
            `  To switch to ${email || "a different email"}, add --replace:\n\n` +
            `    npm run create-admin -- ${email || "new@email.com"} "NewPassword123" --replace\n`
        );

        await mongoose.disconnect();
        process.exit(1);
      }
    } else {
      await Admin.create({
        email,
        password,
        name: "Munch Box Admin",
      });

      console.log(`\nAdmin created: ${email}`);
    }
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
