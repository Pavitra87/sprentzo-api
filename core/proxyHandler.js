import { hash } from "./models/hash.js";
export const handler = {
  get(target, prop, receiver) {
    if (target._schema[prop]) {
      return target._data[prop];
    }
    if (prop === "_id") return target._data[prop];
    if (prop === "id") return target._data["_id"];
    return target[prop];
  },
  async set(target, prop, value) {
    console.log(prop, target._schema[prop], value);
    if (target._schema[prop]) {
      console.log("------------------------------1");
      if (target._schema[prop].hashed) {
        console.log((target._data[prop] = value));
        console.log(target._data[prop], prop);

        return target._data[prop];
      } else {
        console.log(
          "------------------------------3",
          (target._data[prop] = value) || true
        );
        return (target._data[prop] = value) || true;
      }
    } else return (target[prop] = value);
  },
};
