import jwt from "jsonwebtoken";
import credentials from "../credentials.js";
export default async function validateUser(req, res, next) {
  try {
    var data = jwt.verify(req.headers.authorization, credentials.JWTScrete);
    console.log("data")
    console.log(data)
    req.user = await User.readOne(data.id);
    console.log(req.user )
  } catch (e) {
    console.log(e);
    res.status(500).send("Invalid Token or USER")
  }

  next();
}
