import { compare } from "../../core/models/hash.js";
import jwt from "jsonwebtoken";
import credentials from "../../credentials.js";
export default async function loginHandler(app) {
  app.post("/login", async (req, res) => {
    console.log(req.body);
    const user = await User.readAll({ phone: req.body.userId });
    console.log("user");
    console.log(user);
    if (user.length < 1) return res.status(404).send("User not found");
    try {
      console.log(req.body.password, user[0].password);
      console.log("comparing password");
      if (await compare(req.body.password, user[0].password)) {
        var token = jwt.sign({ id: user[0]._id }, credentials.JWTScrete);
        res.send({ token });
      } else {
        res.status(500).send("Invalid password");
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });
  app.post("/forgot", async (req, res) => {
    console.log(req.body);
    const user = await User.readAll({ phone: req.body.userId });
    console.log("user");
    console.log(user);
    if (user.length < 1) return res.status(404).send("User not found");
    try {
      console.log(req.body.password, user[0].password);

      user[0]._data.password = req.body.password;

      user[0].update();

      res.send("asd");
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  });
}
