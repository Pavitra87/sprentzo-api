import jwt from "jsonwebtoken";
import credentials from "../credentials.js";
export default async function validateAccess(req, res, next) {
  try {
    const path = req.route.path;
    const method = Object.keys(req.route.methods)[0];

    const access = await Access.readAll({ path, method });
    if (access.length > 0) {
      if (access[0].permission) {
        return next();
      } else res.status(400).send("you are not authorised");
    } else next();
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
}
