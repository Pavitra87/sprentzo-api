import fs from "fs/promises";
import entities from "../../entities.js";
import validateUser from "../../auth/validateUser.js";
import validateAccess from "../../auth/validateAccess.js";
import pluralize from "pluralize";
export default async function loadRoutes(app) {
  const directoryPath = "./entities";

  // Read the files in the directory
  const files = await fs.readdir(directoryPath);
  await Promise.all(
    files.map(async (file) => {
      if (file !== "index.js") {
        // console.log(`Loading route for ${file}`);
        loadRoute(file, app, entities[file]);
      }
    })
  );
}

async function loadRoute(modelName, app, schema) {
  let routeName = pluralize(modelName, 2).toLocaleLowerCase();
  const controller = new global[`${modelName}Controller`]();
  if (!schema.routeConfig) schema.routeConfig = {};
  app.get(
    `/${routeName}`,
    await getMiddleware(
      schema.routeConfig?.readAll || schema.routeConfig["*"] || false
    ),
    controller.readAll.bind(controller)
  );
  app.get(
    `/${routeName}/:id`,
    await getMiddleware(
      schema.routeConfig?.readOne || schema.routeConfig["*"] || false
    ),
    controller.readOne.bind(controller)
  );
  app.post(
    `/${routeName}`,
    await getMiddleware(
      schema.routeConfig?.create || schema.routeConfig["*"] || false
    ),
    controller.create.bind(controller)
  );
  app.patch(
    `/${routeName}/:id`,
    await getMiddleware(
      schema.routeConfig?.update || schema.routeConfig["*"] || false
    ),
    controller.update.bind(controller)
  );
  app.delete(
    `/${routeName}/:id`,
    await getMiddleware(
      schema.routeConfig?.delete || schema.routeConfig["*"] || false
    ),
    controller.delete.bind(controller)
  );
}
async function getMiddleware(isProtected) {
  let middlewares = [];
  if (isProtected) {
    middlewares.push(validateHeader);
    middlewares.push(validateUser);
    middlewares.push(validateAccess);
  }
  middlewares.push((req, res, next) => {
    next();
  });
  return middlewares;
}

function validateHeader(req, res, next) {
  if (req.headers.authorization) next();
  else res.status(400).send("authorization missing");
}
