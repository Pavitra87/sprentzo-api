// import {loadMongoModels} from "./index.js"
const { Schema } = mongoose;
import mongoose from "mongoose";
import entities from "../entities.js";
import fs from "fs";
import { handler } from "./proxyHandler.js";
import { hash } from "./models/hash.js";
import { genModelString } from "./models/genModelString.js";
import { loadModels } from "./models/loadModel.js";
import { loadControllers } from "./models/loadControllers.js";
import { genControllerString } from "./models/genControllerString.js";
import "../entities/index.js";
import loadAllEntities from "../entities/index.js";
import loadRoutes from "./routes/loadRoutes.js";
import credentials from "../credentials.js";
async function init(app) {
  const dbo = await mongoose.connect(credentials.mongoConnectionString);
  console.log("Begin");
  for (const entity in entities) {
    let { attributes, constrains } = entities[entity];
    Object.keys(attributes).forEach((element) => {
      if (attributes[element].type === "model")
        attributes[element].type = Schema.Types.ObjectId;
      else if (
        Array.isArray(attributes[element].type) &&
        typeof attributes[element].type[0] === "object"
      )
        Object.keys(attributes[element].type[0]).forEach((selem) => {
          // console.log(selem,"+++++++++++++++++++++++++++++++++++++++++++++++++++++")
          if (attributes[element].type[0][selem].type === "model") {
            attributes[element].type[0][selem].type = Schema.Types.ObjectId;
          }
        });
      else if (attributes[element].type === ["model"]) {
        attributes[element].type = [Schema.Types.ObjectId];
      }
      // console.log(element, "----------------------------------------------");
    });

    const schema = new Schema(attributes, {
      timestamps: true,
    });
    if (constrains) {
      if (constrains.unique) {
        constrains.unique.map((d) => {
          schema.index(d, { unique: true });
        });
      }
    }

    const model = mongoose.model(entity, schema);
    if (!global.mongoModels) global.mongoModels = {};

    global.mongoModels[entity] = model;
    await loadModels(entity, attributes);
    await loadControllers(entity, attributes);
  }

  console.log("Base Model loading complete");
  const exists = fs.existsSync("./entities");

  if (!exists) fs.mkdirSync("./entities");

  for (const entity in entities) {
    const exists = fs.existsSync(`./entities/${entity}`);
    if (!exists) fs.mkdirSync(`./entities/${entity}`);
    // console.log(`./entities/${entity}/${entity}Model.js`);
    if (!fs.existsSync(`./entities/${entity}/${entity}Model.js`))
      fs.writeFileSync(
        `./entities/${entity}/${entity}Model.js`,
        genModelString(entity),
        "utf8"
      );
    if (!fs.existsSync(`./entities/${entity}/${entity}Controller.js`))
      fs.writeFileSync(
        `./entities/${entity}/${entity}Controller.js`,
        genControllerString(entity),
        "utf8"
      );
  }

  await loadAllEntities();
  await loadRoutes(app);
  console.log("loaded all entities");
}

export default init;
