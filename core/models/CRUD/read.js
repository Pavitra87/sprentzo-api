export async function read(
  modelName,
  schema = [],
  query = {},
  sort = {},
  limit = 10,
  skip = 0
) {
  // console.log("query", query, { limit, skip });
  console.log("modelName", modelName, "schema", schema, "query", query, "sort", sort, "limit", limit, "skip", skip);
  let qr = mongoModels[modelName].find(query).sort(sort);
  let refs = [];
  for (const attr in schema) {
    if (Array.isArray(schema[attr].type)) {
      if (schema[attr].type[0] === "model") refs.push(attr);
      else {
        if (typeof schema[attr].type[0] === "object") {
          Object.keys(schema[attr].type[0]).forEach((elem) => {
            if (typeof schema[attr].type[0][elem].type === "function") {
              refs.push(`${attr}.${elem}`);
              console.log(`${attr}.${elem}`);
            }
          });
        }
      }
    } else if (typeof schema[attr].type !== "string") {
      refs.push(attr);
    }
  }

  refs.reduce((a, b) => a.populate(b), qr);
  const result = await qr.limit(limit).skip(skip);
  // const result = await qr.sort({'razorOrder.created_at':-1}).limit(limit).skip(skip);
  console.log(result.length);
  return result.map((d) => {
    return new global[modelName]({ ...d._doc }, d);
  });
}
