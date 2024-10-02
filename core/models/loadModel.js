import { read } from "./CRUD/read.js";
import { create } from "./CRUD/create.js";
import BaseClass from "./BaseClass.js";
import { hash } from "./hash.js";
import { handler } from "../proxyHandler.js";
import { update } from "./CRUD/update.js";
import { readOne } from "./CRUD/readOne.js";
import { _delete } from "./CRUD/delete.js";
import { count } from "./CRUD/count.js";

export async function loadModels(modelName, schema) {
  if (!global.BaseModels) global.BaseModels = {};
  global[`Base${modelName}Model`] = class extends BaseClass {
    static schema = schema;
    constructor(data = {}, _raw) {
      super();

      this._data = data;
      this.raw = _raw;
      this._schema = schema;
      Object.keys(schema).forEach((d) => {
        this._data[d] = data[d];
      });

      return new Proxy(this, handler);
    }

    toJSON() {
      return this._data;
    }
    async save() {
      await Promise.all(
        Object.keys(schema).map(async (d) => {
          if (schema[d].hashed) this._data[d] = await hash(this._data[d]);
        })
      );
      const result = await create.bind(this)(modelName, schema);
      console.log("result==================");
      console.log(result);
      this._data["_id"] = result._id;
      return result;
    }

    async update() {
      await Promise.all(
        Object.keys(schema).map(async (d) => {
          if (schema[d].hashed) this._data[d] = await hash(this._data[d]);
        })
      );
      return await update.bind(this)(modelName, schema);
    }
    async delete() {
      return await _delete.bind(this)(modelName, schema);
    }

    static async readOne(id) {
      if (!id) return null;
      return await readOne.bind(this)(modelName, id, schema);
    }
    static async readAll(query = {}, sort = {}, limit = 10, skip = 0) {
      delete query.limit;
      delete query.skip;
      return await read(modelName, schema, query, sort, limit, skip);
    }
    static async count(query = {}) {
      return await count(modelName, schema, query);
    }
  };
  // console.log("model base class created: ", modelName);
}
