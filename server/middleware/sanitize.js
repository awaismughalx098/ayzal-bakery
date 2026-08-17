/* ============================================
   NoSQL INJECTION GUARD
   --------------------------------------------
   Strips Mongo operators like "$gt" and "$ne", plus
   dotted keys, out of the request. Otherwise someone
   could send { "email": { "$ne": null } } and try to
   bypass the login.

   express-mongo-sanitize crashes on Express 5 because
   req.query is now a read-only getter, so this is a
   small local version: it cleans body and params in
   place and only inspects the query.
   ============================================ */

const isPlainObject = (value) =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value);

const isDangerousKey = (key) =>
  key.startsWith("$") ||
  key.includes(".") ||
  key === "__proto__" ||
  key === "constructor" ||
  key === "prototype";

/* Clean the object in place and report how many keys went */

const scrub = (value, removed = { count:0 }) => {

  if(Array.isArray(value)){

    value.forEach(item => scrub(item, removed));

    return removed;

  }

  if(!isPlainObject(value)){
    return removed;
  }

  for(const key of Object.keys(value)){

    if(isDangerousKey(key)){

      delete value[key];

      removed.count++;

      continue;

    }

    scrub(value[key], removed);

  }

  return removed;

};

/* The query is read-only, so only detect */

const hasDangerousKey = (value) => {

  if(Array.isArray(value)){
    return value.some(hasDangerousKey);
  }

  if(!isPlainObject(value)){
    return false;
  }

  return Object.keys(value).some(
    key =>
      isDangerousKey(key) ||
      hasDangerousKey(value[key])
  );

};

const sanitize = (req,res,next) => {

  const removed = { count:0 };

  if(req.body)   scrub(req.body, removed);
  if(req.params) scrub(req.params, removed);

  if(req.query && hasDangerousKey(req.query)){

    return res.status(400).json({
      success:false,
      message:"Invalid request."
    });

  }

  if(removed.count > 0){

    console.warn(
      `[sanitize] ${removed.count} suspicious key(s) removed from ${req.method} ${req.originalUrl}`
    );

  }

  next();

};

module.exports = sanitize;
