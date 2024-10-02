import { read } from "./CRUD/read.js";
import BaseClass from "./BaseClass.js";
import { hash } from "./hash.js";
import { handler } from "../proxyHandler.js";
import BaseController from "../controller/BaseController.js";
export async function loadControllers(modelName, schema) {
  if (!global.BaseControllers) global.BaseControllers = {};
  global[`Base${modelName}Controller`] = class extends BaseController {
    static schema = schema;

    constructor() {
      super(modelName, schema);
    }
  };
  // console.log("Controller base class created: ", modelName);
}
