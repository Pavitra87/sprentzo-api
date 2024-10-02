import init from "./core/initCore.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import credentials from "./credentials.js";
import loginHandler from "./auth/routes/login.js";
import registerHandler from "./auth/routes/register.js";
import validateUser from "./auth/validateUser.js";
import Razorpay from "razorpay";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const port = credentials.appPort;
async function start() {
  await init(app);
  // Define a route
  app.get("/", (req, res) => {
    res.send("Welcome");
  });
  app.get("/profile", validateUser, (req, res) => {
    console.log("req.usser");
    console.log(req.user);
    res.json(req.user);
  });
  app.post("/signup", async (req, res) => {
    console.log("req.usser");
    console.log(req.body);
    const user = new User(req.body);
    try {
      res.json({ data: await user.save() });
    } catch (e) {
      res.status(500).json({ data: "User creation filed" });
    }
  });

  app.post("/rorders", async (req, res) => {
    console.log(req.body);
    const cart = await Cart.readOne(req.body.cart);

    try {
      const instance = new Razorpay({
        key_id: credentials.key_id,
        // "rzp_test_17zGoDKC3vb6uc",
        key_secret: credentials.key_secret,
        //  "mye09VcALsIZ1zNw8kELP88w",
      });

      const options = {
        amount: req.body.amount * 100, // amount in smallest currency unit
        currency: "INR",
        // receipt: "receipt_order_74394",
      };

      const order = await instance.orders.create(options);

      if (!order) return res.status(500).send("Some error occured");
      let tmpOrder = { ...cart.toJSON(), razorOrder: order };
      delete tmpOrder._id;
      delete tmpOrder.createdAt;
      delete tmpOrder.updatedAt;

      console.log(tmpOrder);
      let _order = new Order(tmpOrder);
      await _order.save();

      cart._data.items = [];
      await cart.update();

      res.json({ razOrder: order, order: _order.toJSON() });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
    // sprentzo-sec
  });
  app.post("/razor-callback", async (req, res) => {
    console.log(
      "req.body-------------------------------------------------------------"
    );
    console.log(JSON.stringify(req.body));
    try {
      if (req.body.entity === "event") {
        if (
          req.body.event === "payment.authorized" ||
          req.body.event === "payment.failed"
        ) {
          console.log("req.body.payload.payment.entity.id -   - - - - - -");
          console.log(req.body.payload.payment.entity.id);
          console.log("==========================================");
          const pid = req.body.payload.payment.entity.order_id;
          console.log({ "razorOrder.id": pid });
          const order = await Order.readAll({ "razorOrder.id": pid });
          console.log(order);
          if (order.length > 0) {
            order[0].razorPayment = req.body;
            await order[0].update();
          } // console.log(
          //   await Order.readAll({ "razorOrder.id": "order_LtmlFgNjIEIwrv" })
          // );
        }
      }
    } catch (e) {
      console.log(e);
    }
    res.send("ok");
  });
  app.post("/error-log", (req, res) => {
    console.group("<==============error occurred at client==========>")
    console.error('chua: ', req.headers['sec-ch-ua'])
    console.error('ua: ', req.headers['user-agent'])
    console.error('isMobile: ', req.headers['sec-ch-ua-mobile'])
    console.error('platform: ', req.headers['sec-ch-ua-platform'])
    console.error('error: ', req.body)
    console.error("<==============error occurred at client end==========>")
    console.groupEnd()
    return res.send('OK')
  });

  app.post("/log", (req, res) => {
    const userProfile = JSON.parse(req.body.user)
    console.group("<==============cx pressed Add to cart==========>")
    console.error('_id: ', userProfile._id)
    console.error('firstName: ', userProfile.firstName)
    console.error('lastName: ', userProfile.lastName)
    console.error("<==============cx pressed Add to cart end==========>")
    console.groupEnd()
    return res.send('OK')
  });

  loginHandler(app);
  registerHandler(app);

  // Start the server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
start();
